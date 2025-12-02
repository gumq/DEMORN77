/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {PieChart, BarChart, XAxis, YAxis} from 'react-native-svg-charts';
import {Rect, G, Text as SvgText, Line, Svg} from 'react-native-svg';
import {colors, fontSize} from 'themes';
import {scale} from 'utils/resolutions';

const deviceWidth = Dimensions.get('window').width;
const chartColors = [
  '#22C55E',
  '#FFCC00',
  '#F59E0B',
  '#3B82F6',
  '#F43F5E',
  '#FF4740',
];
const barRadius = 6;
const barHeight = 24;
const spacing = 18;
const maxValue = 250;

const SurveyChart = ({data}) => {
  if (!data) {
    return <Text>Không có dữ liệu để hiển thị</Text>;
  }

  function preparePieChartData(data) {
    const counts = {};
    data.forEach(item => {
      const key = item.RowName;
      counts[key] = (counts[key] || 0) + item.Percentage;
    });

    return Object.entries(counts).map(([key, value], index) => ({
      key,
      value,
      svg: {fill: chartColors[index % chartColors.length]},
      arc: {outerRadius: '100%', innerRadius: '0%', padAngle: 0},
      label: `${key} (${value})`,
    }));
  }

  function prepareBarChartData(data) {
    return data.map(item => ({
      value: item.Percentage ?? 0,
      label: `${item.RowName} (${item.Percentage ?? 0}%)`,
      svg: {fill: '#3B82F6', rx: 6, ry: 6},
    }));
  }

  const CustomBar = ({x, y, data}) => (
    <G>
      {data.map((item, index) => (
        <Rect
          key={index}
          x={0}
          y={y(index) + spacing / 2}
          width={x(item.value)}
          height={barHeight}
          rx={barRadius}
          ry={barRadius}
          fill={item.svg.fill}
        />
      ))}
    </G>
  );

  const VerticalGrid = ({chartWidth, chartHeight, count}) => {
    const ticks = Array.from(
      {length: count + 1},
      (_, i) => (maxValue / count) * i,
    );
    return (
      <G>
        {ticks.map((tick, i) => {
          const x = (tick / maxValue) * chartWidth;
          return (
            <Line
              key={`v-${i}`}
              x1={x}
              x2={x}
              y1={0}
              y2={chartHeight}
              stroke="#D1D5DB"
              strokeWidth={1}
              strokeDasharray={[4, 4]}
            />
          );
        })}
      </G>
    );
  };

  const HorizontalGrid = ({barCount, chartWidth}) => {
    return (
      <G>
        {Array.from({length: barCount + 1}, (_, i) => {
          const y = i * (barHeight + spacing) + spacing / 2;
          return (
            <Line
              key={`h-${i}`}
              x1={0}
              x2={chartWidth}
              y1={y}
              y2={y}
              stroke="#D1D5DB"
              strokeWidth={1}
              strokeDasharray={[4, 4]}
            />
          );
        })}
      </G>
    );
  };

  function prepareMultiBarChartData_XAxisRowName(data) {
    const rowNames = Array.from(new Set(data.map(item => item.RowName)));
    const columnNames = Array.from(new Set(data.map(item => item.ColumnName)));

    const datasets = columnNames.map((col, i) => ({
      key: `col-${i}`,
      rowName: col,
      svg: {fill: chartColors[i % chartColors.length]},
      data: rowNames.map(row => {
        const found = data.find(d => d.RowName === row && d.ColumnName === col);
        return found ? found.Percentage : 0;
      }),
    }));

    return {labels: rowNames, datasets};
  }

  const chartHeight = 180;

  const ChartTN = ({questionName, pieData}) => {
    const total = pieData.reduce((sum, slice) => sum + slice.value, 0);

    const pieDataForChart = pieData.filter(slice => slice.value > 0);

    return (
      <View key={questionName} style={styles.chartContainer}>
        <Text style={styles.questionTitle}>{questionName}</Text>

        <View style={styles.pieChart}>
          <PieChart
            style={{height: chartHeight, width: chartHeight}}
            data={pieDataForChart.map(slice => ({
              ...slice,
              arc: {
                outerRadius: '100%',
                innerRadius: '0%',
                padAngle: 0,
              },
            }))}
          />

          <View style={{marginLeft: 16, flex: 1}}>
            {pieData?.map(slice => {
              const percent =
                total === 0 ? 0 : ((slice.value / total) * 100).toFixed(1);
              return (
                <View key={slice.key} style={styles.slicePie}>
                  <View
                    style={[
                      styles.pieDescription,
                      {backgroundColor: slice.svg.fill},
                    ]}
                  />
                  <Text
                    style={
                      styles.txtDescription
                    }>{`${slice.key.trim()} (${percent}%)`}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {Object.entries(data).map(([questionType, questions]) =>
        Object.entries(questions).map(([questionName, questionObj]) => {
          const questionData = questionObj.Option;

          if (!questionData || questionData.length === 0) {
            return (
              <View key={questionName} style={{marginBottom: 30}}>
                <Text>{questionName}</Text>
                <Text style={{color: 'red'}}>Không có dữ liệu để hiển thị</Text>
              </View>
            );
          }

          if (questionType === 'TN') {
            const pieData = preparePieChartData(questionData);
            return <ChartTN questionName={questionName} pieData={pieData} />;
          }

          if (questionType === 'HK') {
            const barData = prepareBarChartData(questionData);
            const labels = barData.map(d => d.label);

            const chartHeight = barData.length * (barHeight + spacing);
            const contentInset = {top: 10, bottom: 10};
            const yAxisWidth = 140;
            const barChartWidth = deviceWidth - yAxisWidth - 50;

            return (
              <View key={questionName} style={styles.chartContainer}>
                <Text style={styles.questionTitle}>{questionName}</Text>

                <View style={styles.containerChartMulti}>
                  <View
                    style={{
                      width: yAxisWidth,
                      height: chartHeight,
                      justifyContent: 'flex-start',
                      marginRight: 8,
                    }}>
                    {labels.map((label, index) => (
                      <Text
                        key={index}
                        style={[
                          styles.txtDescriptionBarchart,
                          {
                            height: barHeight + spacing,
                            textAlignVertical: 'center',
                          },
                        ]}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {label}
                      </Text>
                    ))}
                  </View>

                  <View>
                    <BarChart
                      style={{height: chartHeight, width: barChartWidth}}
                      data={barData}
                      yAccessor={({index}) => index}
                      xAccessor={({item}) => item.value}
                      horizontal
                      spacingInner={0.3}
                      contentInset={contentInset}
                      gridMin={0}
                      gridMax={maxValue}>
                      <VerticalGrid
                        chartWidth={barChartWidth}
                        chartHeight={chartHeight}
                        count={6}
                      />
                      <HorizontalGrid
                        barCount={barData.length}
                        chartWidth={barChartWidth}
                      />
                      <CustomBar />
                    </BarChart>
                    <XAxis
                      style={{marginTop: 8, width: barChartWidth}}
                      data={[0, 50, 100, 150, 200, 250]}
                      numberOfTicks={6}
                      contentInset={{left: 5, right: 10}}
                      svg={{fontSize: 12, fill: 'black'}}
                      min={0}
                      max={maxValue}
                      formatLabel={value => `${value}`}
                    />
                  </View>
                </View>
              </View>
            );
          }

          if (questionType === 'TDTT') {
            const barData = prepareBarChartData(questionData);
            const values = barData.map(d => d.value);
            const labels = barData.map(d => d.label);

            const chartHeight = 200;
            const chartWidth = deviceWidth - 45;
            const barWidth = 24;
            const spacingInner = 0.3;
            const yAxisWidth = 30;
            const marginLeft = 10;
            const yMax = 200;
            const yAxisTicks = [0, 50, 100, 150, 200];
            const horizontalLines = Array.from({length: 7}, (_, i) =>
              Math.round(i * (yMax / 6)),
            );

            const Bars = ({x, y, bandwidth, data}) => {
              const bottomInset = 10;
              const topInset = 10;
              const height = chartHeight - topInset - bottomInset;
              const minHeight = 30;

              return (
                <G>
                  {data.map((value, index) => {
                    const xPos = x(index) + (bandwidth - barWidth) / 2 - 10;

                    const isZero = value === 0;
                    const actualHeight = isZero
                      ? minHeight
                      : Math.ceil(minHeight + 18);
                    const yPos = topInset + height - actualHeight;

                    return (
                      <Rect
                        key={index}
                        x={xPos}
                        y={yPos}
                        width={barWidth}
                        height={actualHeight}
                        rx={6}
                        ry={6}
                        fill="#3B82F6"
                      />
                    );
                  })}
                </G>
              );
            };

            const VerticalGridLines = ({x, y, bandwidth, data}) => (
              <G>
                {Array.from({length: data.length + 1}, (_, i) => {
                  const xPos =
                    i < data.length ? x(i) : x(data.length - 1) + bandwidth;
                  return (
                    <Line
                      key={`v-${i}`}
                      x1={xPos}
                      y1={y(0)}
                      x2={xPos}
                      y2={y(yMax)}
                      stroke="#D1D5DB"
                      strokeDasharray={[4, 4]}
                    />
                  );
                })}
              </G>
            );

            const HorizontalGridLines = ({y}) => (
              <G>
                {horizontalLines.map((value, index) => (
                  <Line
                    key={`h-${index}`}
                    x1={0}
                    y1={y(value)}
                    x2={chartWidth - yAxisWidth - marginLeft}
                    y2={y(value)}
                    stroke="#D1D5DB"
                    strokeDasharray={[4, 4]}
                  />
                ))}
              </G>
            );

            return (
              <View style={styles.chartContainer}>
                <Text style={styles.questionTitle}>{questionName}</Text>
                <View style={{flexDirection: 'row', height: chartHeight + 40}}>
                  <YAxis
                    data={yAxisTicks}
                    style={[
                      styles.txtDescriptionBarchart,
                      {width: yAxisWidth, marginLeft},
                    ]}
                    contentInset={{top: 40, bottom: 80}}
                    numberOfTicks={yAxisTicks.length}
                    min={0}
                    max={yMax}
                    formatLabel={value => `${value}`}
                  />
                  <View>
                    <BarChart
                      style={{
                        height: chartHeight,
                        width: chartWidth - yAxisWidth,
                      }}
                      data={values}
                      yAccessor={({item}) => item}
                      spacingInner={spacingInner}
                      svg={{fill: 'transparent'}}
                      gridMin={0}
                      gridMax={yMax}
                      contentInset={{top: 10, bottom: 10}}>
                      <HorizontalGridLines />
                      <VerticalGridLines />
                      <Bars />
                    </BarChart>
                    <XAxis
                      style={{marginTop: 8}}
                      data={values}
                      formatLabel={index => labels[index]}
                      contentInset={{left: 25, right: 35}}
                      svg={{fontSize: 10, fill: 'black'}}
                    />
                  </View>
                </View>
              </View>
            );
          }

          if (questionType === 'LHK' || questionType === 'LTN') {
            const {labels, datasets} =
              prepareMultiBarChartData_XAxisRowName(questionData);

            const chartHeight = 250;
            const barWidth = 16;
            const groupSpacing = 24;
            const barSpacing = 4;
            const yAxisWidth = 40;
            const yAxisTicks = [0, 50, 100, 150, 200];
            const maxValue = 100;
            const contentInset = {top: 10, bottom: 10};
            const adjustedChartHeight =
              chartHeight - contentInset.top - contentInset.bottom;
            const groupTotalWidth =
              barWidth * datasets.length + barSpacing * (datasets.length - 1);
            const groupFullWidth = groupTotalWidth + groupSpacing;
            const barChartWidth = groupFullWidth * labels.length + 23;

            const HorizontalGridLines = () => {
              const numberOfLines = 7;
              const ticks = Array.from(
                {length: numberOfLines},
                (_, i) => (i * maxValue) / (numberOfLines - 1),
              );

              return (
                <G>
                  {ticks.map((value, index) => {
                    const y =
                      chartHeight -
                      contentInset.bottom -
                      (value / maxValue) * adjustedChartHeight;
                    return (
                      <Line
                        key={`h-${index}`}
                        x1={0}
                        x2={barChartWidth}
                        y1={y}
                        y2={y}
                        stroke="#D1D5DB"
                        strokeWidth={1}
                        strokeDasharray={[4, 4]}
                      />
                    );
                  })}
                </G>
              );
            };

            const VerticalGridLines = () => {
              const numberOfLines = 6;
              return (
                <G>
                  {Array.from({length: numberOfLines}, (_, i) => {
                    const x = (i * barChartWidth) / (numberOfLines - 1);
                    return (
                      <Line
                        key={`v-${i}`}
                        x1={x}
                        x2={x}
                        y1={0}
                        y2={chartHeight}
                        stroke="#D1D5DB"
                        strokeWidth={1}
                        strokeDasharray={[4, 4]}
                      />
                    );
                  })}
                </G>
              );
            };

            return (
              <View key={questionName} style={styles.chartContainer}>
                <Text style={styles.questionTitle}>{questionName}</Text>

                <View style={styles.multiChartDescription}>
                  {datasets.map((dataset, index) => (
                    <View
                      key={`legend-${index}`}
                      style={styles.containerLegend}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: dataset.svg.fill,
                          marginRight: 6,
                          borderRadius: 2,
                        }}
                      />
                      <Text style={styles.txtLegend}>{dataset.rowName}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.containerChartMulti}>
                  <YAxis
                    data={yAxisTicks}
                    style={[
                      styles.txtDescriptionBarchart,
                      {width: yAxisWidth, marginLeft: 10},
                    ]}
                    contentInset={{top: 50, bottom: 95}}
                    numberOfTicks={yAxisTicks.length}
                    min={0}
                    max={200}
                    formatLabel={value => `${value}`}
                  />

                  <ScrollView
                    horizontal
                    style={{marginLeft: 10}}
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.containerGird}>
                      <Svg
                        width={barChartWidth}
                        height={chartHeight}
                        style={{position: 'absolute'}}>
                        <HorizontalGridLines />
                        <VerticalGridLines />
                      </Svg>

                      {labels.map((label, labelIndex) => (
                        <View
                          key={`group-${label}`}
                          style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginHorizontal: groupSpacing / 2,
                            width: groupTotalWidth + 8,
                          }}>
                          <View
                            style={[
                              styles.containerBarHeight,
                              {height: chartHeight},
                            ]}>
                            {datasets.map(dataset => {
                              const value = dataset.data[labelIndex];
                              const barHeight =
                                value != 0 ? Math.ceil(value + 30) : 40;

                              return (
                                <View
                                  key={`bar-${dataset.key}-${labelIndex}`}
                                  style={{
                                    width: barWidth,
                                    height: barHeight,
                                    backgroundColor: dataset.svg.fill,
                                    marginHorizontal: barSpacing / 2,
                                    borderRadius: 4,
                                  }}
                                />
                              );
                            })}
                          </View>
                          <Text
                            style={styles.txtDescriptionBarchart}
                            numberOfLines={2}>
                            {label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            );
          }

          if (questionType === 'VB') {
            return (
              <View key={questionName} style={styles.chartContainer}>
                <Text style={styles.questionTitle}>{questionName}</Text>

                <View style={styles.containerText}>
                  <View style={styles.header}>
                    <Text style={styles.txtTitleAnswer}>Câu trả lời</Text>
                  </View>

                  {questionData.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        padding: 12,
                        borderBottomWidth:
                          index < questionData.length - 1 ? 1 : 0,
                        borderColor: '#E5E7EB',
                      }}>
                      <Text style={styles.txtValueAnswer}>
                        {item.AnswerText}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          }

          return (
            <View key={questionName} style={{paddingVertical: 10}}>
              <Text style={styles.questionTitle}>{questionName}</Text>
              <Text>Loại câu hỏi {questionType} không được hỗ trợ.</Text>
            </View>
          );
        }),
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(12),
    marginTop: scale(12),
  },
  chartContainer: {
    marginBottom: scale(8),
    backgroundColor: colors.white,
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    width: '100%',
  },
  questionTitle: {
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
    color: colors.black,
    marginHorizontal: scale(12),
    marginTop: scale(12),
    marginBottom: scale(8),
  },
  pieChart: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: scale(12),
  },
  pieDescription: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    marginRight: scale(8),
  },
  txtDescription: {
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    color: colors.black,
  },
  barchartHorizontal: {
    marginHorizontal: scale(12),
    flexDirection: 'row',
    marginBottom: scale(12),
  },
  txtDescriptionBarchart: {
    fontSize: fontSize.size12,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(20),
    color: colors.black,
    overflow: 'hidden',
    width: '70%',
    marginLeft: scale(12),
  },
  multiChartDescription: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: scale(12),
    fontSize: fontSize.size12,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(20),
    color: colors.black,
  },
  containerLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(12),
    marginBottom: scale(6),
  },
  txtLegend: {
    fontSize: fontSize.size12,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(20),
    color: colors.black,
  },
  containerChartMulti: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  containerGird: {
    flexDirection: 'row',
    paddingBottom: scale(16),
  },
  containerBarHeight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: scale(8),
  },
  slicePie: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  containerText: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    overflow: 'hidden',
  },
  header: {
    padding: scale(8),
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
  txtTitleAnswer: {
    fontSize: fontSize.size12,
    fontWeight: '600',
    fontFamily: 'Inter-SeminBold',
    lineHeight: scale(20),
    color: '#525252',
  },
  txtValueAnswer: {
    fontSize: fontSize.size12,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(20),
    color: colors.black,
  },
});

export default SurveyChart;
