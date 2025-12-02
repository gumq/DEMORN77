// /* eslint-disable react-native/no-inline-styles */
// import React, {useEffect, useState, useCallback, useRef} from 'react';
// import {
//   View,
//   TouchableOpacity,
//   ScrollView,
//   RefreshControl,
//   StyleSheet,
//   Modal,
//   Dimensions,
//   Pressable,
//   Platform,
//   Text,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   Linking,
//   PermissionsAndroid,
//   ActionSheetIOS,
//   AppState,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {useSelector} from 'react-redux';
// import DeviceInfo from 'react-native-device-info';
// import NetInfo from '@react-native-community/netinfo';
// import Clipboard from '@react-native-clipboard/clipboard';
// import CallLogs from 'react-native-call-log'; // yarn add react-native-call-log
// import {translateLang} from '../../store/accLanguages/slide';
// import {colors, fontSize} from '../../themes';
// import {scale} from '../../utils/resolutions';
// import {HeaderBack} from '../../components';

// /* ================== helpers ================== */
// const {width, height} = Dimensions.get('window');
// const CARD_W = (width - scale(48)) / 2;
// const CARD_H = Math.max(scale(140), (height - scale(300)) / 3);

// const pct = (num, den) =>
//   num || den ? `${Math.round(((num || 0) / (den || 1)) * 100)}%` : '—';
// const safe = v => (v === null || v === undefined || v === '' ? '—' : String(v));
// const getOsIcon = name => {
//   const n = (name || '').toLowerCase();
//   if (n.includes('ios')) return '🍎';
//   if (n.includes('android')) return '🤖';
//   return '📱';
// };
// const getNetworkIcon = type =>
//   type === 'wifi' ? '📶' : type === 'cellular' ? '📡' : '🌐';

// const fmtDuration = s => {
//   const sec = Number(s || 0);
//   if (!sec) return '0s';
//   const m = Math.floor(sec / 60);
//   const r = sec % 60;
//   return m ? `${m}m ${r}s` : `${r}s`;
// };
// const fmtDateTime = ms => {
//   const t = Number(ms || 0);
//   if (!t) return '—';
//   return new Date(t).toLocaleString();
// };

// // Chuẩn hoá & so khớp số theo "thuê bao core" (+84/00/0)
// const digitsOnly = s => (s || '').replace(/\D/g, '');
// const toSubscriberCore = raw => {
//   let s = digitsOnly(raw);
//   if (s.startsWith('00')) s = s.slice(2); // 00 + country
//   if (s.startsWith('84')) s = s.slice(2); // VN
//   if (s.startsWith('0')) s = s.slice(1); // nội địa
//   return s;
// };
// const isSameSubscriber = (a, b) => {
//   const A = toSubscriberCore(a),
//     B = toSubscriberCore(b);
//   if (!A || !B) return false;
//   if (A === B) return true;
//   const tail = (s, n) => s.slice(-n);
//   return tail(A, 9) === tail(B, 9) || tail(A, 8) === tail(B, 8);
// };

// // Trạng thái text cho từng call log (nhà mạng)
// const callStatusText = call => {
//   if (!call) return 'Không xác định';
//   const typeStr = String(call.type || '').toUpperCase();
//   const raw = Number(call.rawType);
//   const isOutgoing = raw === 2 || typeStr === 'OUTGOING';
//   const isIncoming = raw === 1 || typeStr === 'INCOMING';
//   const isMissed = raw === 3 || typeStr === 'MISSED';
//   const isRejected = raw === 5 || typeStr === 'REJECTED';
//   const isUnknown = raw === 6 || typeStr === 'UNKNOWN';

//   if (isOutgoing)
//     return call.duration > 0 ? 'Đã gọi thành công' : 'Gọi đi (không bắt máy)';
//   if (isIncoming)
//     return call.duration > 0
//       ? 'Cuộc gọi đến (đã nghe)'
//       : 'Cuộc gọi đến (bỏ lỡ)';
//   if (isMissed) return 'Cuộc gọi nhỡ';
//   if (isRejected) return 'Cuộc gọi bị từ chối';
//   if (isUnknown) return 'Không rõ trạng thái';
//   return 'Khác';
// };
// const statusColor = call => {
//   const s = callStatusText(call);
//   if (s.includes('thành công') || s.includes('đã nghe')) return '#0a7f2e'; // xanh
//   if (s.includes('nhỡ') || s.includes('không bắt')) return '#b00020'; // đỏ
//   if (s.includes('không rõ') || s.includes('từ chối')) return '#6b7280'; // xám
//   return '#111827';
// };

// /* ================== Tile Component ================== */
// const Tile = ({icon, title, main, sub, color, onPress}) => (
//   <TouchableOpacity
//     activeOpacity={0.9}
//     onPress={onPress}
//     style={[ui.card, {backgroundColor: color}]}>
//     <View style={ui.cardTop}>
//       <Text style={ui.icon}>{icon}</Text>
//       <Text style={ui.title}>{title}</Text>
//     </View>
//     <Text style={ui.main} numberOfLines={1}>
//       {main}
//     </Text>
//     {!!sub && (
//       <Text style={ui.sub} numberOfLines={1}>
//         {sub}
//       </Text>
//     )}
//   </TouchableOpacity>
// );

// /* ================== Main Screen ================== */
// const InfoVersionScreen = ({navigation}) => {
//   const languageKey = useSelector(translateLang);
//   const [loading, setLoading] = useState(true);
//   const [app, setApp] = useState({});
//   const [device, setDevice] = useState({});
//   const [network, setNetwork] = useState({});
//   const [powerMem, setPowerMem] = useState({});
//   const [detailKey, setDetailKey] = useState(null);

//   // Lịch sử nhà mạng cho số đang xem
//   const [showHistory, setShowHistory] = useState(false);
//   const [callHistory, setCallHistory] = useState([]);

//   // Lịch sử Zalo tự log (ước lượng duration)
//   const [externalCalls, setExternalCalls] = useState([]);

//   // app state ref
//   const appStateRef = useRef(AppState.currentState);

//   /* ==== Thu thập thông tin thiết bị ==== */
//   const collect = useCallback(async () => {
//     setLoading(true);
//     try {
//       const appName = DeviceInfo.getApplicationName();
//       const version = DeviceInfo.getVersion();
//       const buildNumber = DeviceInfo.getBuildNumber();
//       const readableVersion = DeviceInfo.getReadableVersion();
//       const bundleId = DeviceInfo.getBundleId();
//       setApp({appName, version, buildNumber, readableVersion, bundleId});

//       const brand = DeviceInfo.getBrand();
//       const model = DeviceInfo.getModel();
//       const deviceName = await DeviceInfo.getDeviceName();
//       const systemName = DeviceInfo.getSystemName();
//       const systemVersion = DeviceInfo.getSystemVersion();
//       const isEmulator = await DeviceInfo.isEmulator();
//       const totalMem = await DeviceInfo.getTotalMemory();
//       let usedMem = null;
//       try {
//         usedMem = await DeviceInfo.getUsedMemory();
//       } catch {}
//       const totalDisk = await DeviceInfo.getTotalDiskCapacity();
//       const freeDisk = await DeviceInfo.getFreeDiskStorage();
//       setDevice({
//         brand,
//         model,
//         deviceName,
//         systemName,
//         systemVersion,
//         isEmulator,
//         totalMem,
//         usedMem,
//         totalDisk,
//         freeDisk,
//       });

//       let batteryLevel = null,
//         isCharging = null;
//       try {
//         batteryLevel = await DeviceInfo.getBatteryLevel();
//         isCharging = await DeviceInfo.isBatteryCharging();
//       } catch {}
//       setPowerMem({batteryLevel, isCharging});

//       const net = await NetInfo.fetch();
//       const {type, isConnected, isInternetReachable, details = {}} = net || {};
//       const {ssid, carrier} = details || {};
//       setNetwork({type, isConnected, isInternetReachable, ssid, carrier});
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     collect();
//   }, [collect]);

//   const usedDisk =
//     device.totalDisk && device.freeDisk
//       ? device.totalDisk - device.freeDisk
//       : null;

//   const tiles = [
//     {
//       key: 'app',
//       icon: '🧩',
//       title: 'Ứng dụng',
//       main: safe(app.readableVersion),
//       sub: safe(app.bundleId),
//       color: '#E3F2FD',
//     },
//     {
//       key: 'device',
//       icon: getOsIcon(device.systemName || Platform.OS),
//       title: ` ${safe(device.model)}`,
//       main: `${safe(device.systemName)} ${safe(device.systemVersion)}`,
//       sub: device.isEmulator ? '(Giả lập)' : safe(device.deviceName),
//       color: '#E8F5E9',
//     },
//     {
//       key: 'memory',
//       icon: '🧠',
//       title: 'Bộ nhớ',
//       main:
//         device.usedMem && device.totalMem
//           ? pct(device.usedMem, device.totalMem)
//           : '—',
//       sub:
//         usedDisk && device.totalDisk
//           ? `Lưu trữ: ${pct(usedDisk, device.totalDisk)}`
//           : '—',
//       color: '#FFF8E1',
//     },
//     {
//       key: 'network',
//       icon: getNetworkIcon(network.type),
//       title: 'Kết nối',
//       main: network.isConnected
//         ? network.type === 'wifi'
//           ? `Wi-Fi ${safe(network.ssid)}`
//           : `Di động ${safe(network.carrier)}`
//         : 'Mất kết nối',
//       sub:
//         typeof network.isInternetReachable === 'boolean'
//           ? network.isInternetReachable
//             ? 'Internet OK'
//             : 'Không có mạng'
//           : '—',
//       color: '#E1F5FE',
//     },
//     {
//       key: 'battery',
//       icon: '🔋',
//       title: 'Pin',
//       main:
//         typeof powerMem.batteryLevel === 'number'
//           ? `${Math.round(powerMem.batteryLevel * 100)}%`
//           : '—',
//       sub: powerMem.isCharging ? 'Đang sạc' : 'Không sạc',
//       color: '#FFF3E0',
//     },
//     {
//       key: 'actions',
//       icon: '🧾',
//       title: 'Báo cáo',
//       main: 'Sao chép nhanh',
//       sub: 'JSON chẩn đoán',
//       color: '#EDE7F6',
//       onPress: () => {
//         Clipboard.setString(JSON.stringify({app, device, network, powerMem}));
//         Alert.alert('Đã sao chép thông tin');
//       },
//     },
//   ];

//   /* ==== Chức năng liên hệ ==== */
//   const toE164 = (raw, countryCode = '84') => {
//     const digits = (raw || '').replace(/\D/g, '');
//     if (!digits) return '';
//     if (digits.startsWith('0')) return `+${countryCode}${digits.slice(1)}`;
//     if (digits.startsWith(countryCode)) return `+${digits}`;
//     if (digits.startsWith(`+${countryCode}`)) return digits;
//     return `+${countryCode}${digits}`;
//   };

//   const openDialer = async phone => {
//     const url = `tel:${phone}`;
//     const can = await Linking.canOpenURL(url);
//     if (can) return Linking.openURL(url);
//     Alert.alert('Không thể mở Phone app');
//   };

//   const openZaloCore = async raw => {
//     const phone = (raw || '').replace(/\D/g, '');
//     const candidates = [`zalo://chat?phone=${phone}`, `zalo://qr/p/${phone}`];
//     for (const url of candidates) {
//       try {
//         if (await Linking.canOpenURL(url)) {
//           await Linking.openURL(url);
//           return true;
//         }
//       } catch {}
//     }
//     const webUrl = `https://zalo.me/${phone}`;
//     try {
//       await Linking.openURL(webUrl);
//       return true;
//     } catch {
//       Alert.alert('Không mở được Zalo');
//       return false;
//     }
//   };

//   // --- Logger thao tác Zalo (ước lượng) ---
//   const logExternalStart = ({type, phone}) => {
//     const id = `${type}-${Date.now()}`;
//     setExternalCalls(prev =>
//       prev.concat({
//         id,
//         type,
//         phone,
//         startedAt: Date.now(),
//         endedAt: null,
//         durationMs: null,
//         status: 'attempted', // attempted | estimated
//       }),
//     );
//     return id;
//   };
//   const logExternalEnd = id => {
//     setExternalCalls(prev =>
//       prev.map(it => {
//         if (it.id !== id) return it;
//         const endedAt = Date.now();
//         return {
//           ...it,
//           endedAt,
//           durationMs: Math.max(0, endedAt - it.startedAt),
//           status: 'estimated',
//         };
//       }),
//     );
//   };

//   const openZaloWithLogging = async raw => {
//     const phone = (raw || '').replace(/\D/g, '');
//     const callId = logExternalStart({type: 'zalo', phone});
//     console.log('callId', callId);
//     const sub = AppState.addEventListener('change', state => {
//       if (
//         appStateRef.current.match(/inactive|background/) &&
//         state === 'active'
//       ) {
//         logExternalEnd(callId);
//         sub.remove();
//       }
//       appStateRef.current = state;
//     });
//     const ok = await openZaloCore(raw);
//     if (!ok) {
//       // mở thất bại → kết thúc log luôn
//       logExternalEnd(callId);
//       try {
//         sub.remove();
//       } catch {}
//     }
//   };

//   const requestCallLogPermission = async () => {
//     if (Platform.OS !== 'android') return true;
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   };

//   // Lấy lịch sử gần đây cho đúng số (nhà mạng)
//   const fetchRecentCallsFor = async rawNumber => {
//     if (Platform.OS !== 'android') return [];
//     const ok = await requestCallLogPermission();
//     if (!ok) return [];
//     let logs = [];
//     try {
//       logs = await CallLogs.load(30);
//     } catch {
//       return [];
//     }
//     const now = Date.now();
//     const timeWindowMs = 6 * 60 * 60 * 1000; // 6 giờ gần nhất
//     return (logs || [])
//       .filter(l => {
//         const ms = Number(l?.timestamp || l?.dateTime || 0);
//         const recent = ms && now - ms <= timeWindowMs;
//         return recent && isSameSubscriber(l?.phoneNumber, rawNumber);
//       })
//       .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
//   };

//   // === Nhấn vào số điện thoại ===
//   const rawPhone = '0978709369'; // thay bằng số thực tế
//   const e164 = toE164(rawPhone, '84');

//   const handlePressPhone = () => {
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Huỷ', 'Gọi điện', 'Zalo'],
//           cancelButtonIndex: 0,
//         },
//         async idx => {
//           switch (idx) {
//             case 1:
//               await openDialer(e164);
//               break;
//             case 2:
//               await openZaloWithLogging(rawPhone);
//               break;
//           }
//         },
//       );
//     } else {
//       Alert.alert('Liên hệ', rawPhone, [
//         {text: 'Zalo', onPress: () => openZaloWithLogging(rawPhone)},
//         {
//           text: 'Gọi điện',
//           onPress: async () => {
//             const sub = AppState.addEventListener('change', async state => {
//               if (
//                 appStateRef.current.match(/inactive|background/) &&
//                 state === 'active'
//               ) {
//                 const history = await fetchRecentCallsFor(rawPhone);
//                 if (!history.length) {
//                   Alert.alert('Cuộc gọi', 'Không tìm thấy bản ghi phù hợp');
//                 } else {
//                   setCallHistory(history);
//                   setShowHistory(true);
//                 }
//                 sub.remove();
//               }
//               appStateRef.current = state;
//             });
//             await openDialer(e164);
//           },
//         },
//         {text: 'Huỷ', style: 'cancel'},
//       ]);
//     }
//   };

//   /* ==== Render ==== */
//   return (
//     <LinearGradient
//       colors={['#fff', '#fff']}
//       style={{flex: 1}}
//       start={{x: 0.44, y: 0.45}}
//       end={{x: 1.22, y: 0.25}}>
//       {/* Header */}
//       <StatusBar
//         animated
//         barStyle="dark-content"
//         backgroundColor={colors.white}
//         translucent={false}
//       />

//       <SafeAreaView style={ui.safeArea}>
//         <HeaderBack
//           title={languageKey('_version')}
//           onPress={() => navigation.goBack()}
//         />

//         {/* Body */}
//         <ScrollView
//           contentContainerStyle={{padding: scale(16), paddingBottom: scale(60)}}
//           refreshControl={
//             <RefreshControl refreshing={loading} onRefresh={collect} />
//           }>
//           <View style={ui.grid}>
//             {tiles.map((t, i) => (
//               <Tile
//                 key={i}
//                 {...t}
//                 onPress={() => (t.onPress ? t.onPress() : setDetailKey(t.key))}
//               />
//             ))}
//           </View>
//         </ScrollView>

//         {/* Bấm số để chọn hành động */}
//         <TouchableOpacity onPress={handlePressPhone} activeOpacity={0.7}>
//           <Text style={{padding: 12, fontWeight: '600', color: colors.blue}}>
//             {rawPhone}
//           </Text>
//         </TouchableOpacity>

//         {/* Modal chi tiết (nếu bạn dùng) */}
//         <Modal
//           transparent
//           visible={!!detailKey}
//           animationType="fade"
//           onRequestClose={() => setDetailKey(null)}>
//           <Pressable
//             style={ui.modalBackdrop}
//             onPress={() => setDetailKey(null)}>
//             {/* chặn propagation khi bấm vào card */}
//             <Pressable
//               style={[ui.modalCard, {backgroundColor: colors.white}]}
//               onPress={e => e.stopPropagation()}>
//               <Text style={ui.modalTitle}>
//                 {tiles.find(x => x.key === detailKey)?.title || 'Chi tiết'}
//               </Text>

//               <View style={{marginTop: scale(8)}}>
//                 {/* render detail nếu cần */}
//               </View>

//               <TouchableOpacity
//                 onPress={() => setDetailKey(null)}
//                 style={[
//                   ui.btn,
//                   {backgroundColor: colors.blue, marginTop: scale(14)},
//                 ]}>
//                 <Text style={ui.btnText}>Đóng</Text>
//               </TouchableOpacity>
//             </Pressable>
//           </Pressable>
//         </Modal>

//         {/* Modal lịch sử cuộc gọi (Android) */}
//         <Modal
//           transparent
//           visible={showHistory}
//           animationType="slide"
//           onRequestClose={() => setShowHistory(false)}>
//           <Pressable
//             style={ui.modalBackdrop}
//             onPress={() => setShowHistory(false)}>
//             <ScrollView>
//               <Pressable
//                 style={[ui.modalCard, {backgroundColor: colors.white}]}
//                 onPress={e => e.stopPropagation()}>
//                 <Text style={ui.modalTitle}>Lịch sử cuộc gọi: {rawPhone}</Text>

//                 {Platform.OS !== 'android' ? (
//                   <Text>iOS không hỗ trợ đọc lịch sử cuộc gọi.</Text>
//                 ) : (
//                   <View style={{gap: scale(8)}}>
//                     {/* Tổng số bản ghi nhà mạng cho số này */}
//                     <Text style={{marginBottom: scale(6)}}>
//                       <Text style={{fontWeight: '600'}}>Số cuộc gọi: </Text>
//                       {callHistory.length}
//                     </Text>

//                     {callHistory.map((c, idx) => (
//                       <View
//                         key={`${c.timestamp || c.dateTime || idx}`}
//                         style={{
//                           paddingVertical: scale(8),
//                           borderBottomWidth: StyleSheet.hairlineWidth,
//                           borderBottomColor: '#eee',
//                         }}>
//                         <Text style={{fontWeight: '600'}}>
//                           {c.phoneNumber ? `Số: ${c.phoneNumber}` : 'Số: —'}
//                         </Text>
//                         <Text>
//                           Thời gian: {fmtDateTime(c?.timestamp || c?.dateTime)}
//                         </Text>
//                         <Text>Thời lượng: {fmtDuration(c?.duration)}</Text>
//                         {!!c?.name && <Text>Danh bạ: {c.name}</Text>}
//                         <Text style={{marginTop: 2, color: statusColor(c)}}>
//                           Trạng thái: {callStatusText(c)}
//                         </Text>
//                       </View>
//                     ))}

//                     {/* Lịch sử thao tác Zalo cho đúng số (ước lượng) */}
//                     {!!externalCalls.length && (
//                       <View style={{marginTop: scale(12)}}>
//                         <Text
//                           style={{fontWeight: '700', marginBottom: scale(6)}}>
//                           Lịch sử thao tác Zalo
//                         </Text>
//                         {externalCalls
//                           .filter(
//                             x =>
//                               x.type === 'zalo' &&
//                               isSameSubscriber(x.phone, rawPhone),
//                           )
//                           .sort((a, b) => b.startedAt - a.startedAt)
//                           .slice(0, 10)
//                           .map(x => (
//                             <View
//                               key={x.id}
//                               style={{
//                                 paddingVertical: scale(8),
//                                 borderBottomWidth: StyleSheet.hairlineWidth,
//                                 borderBottomColor: '#eee',
//                               }}>
//                               <Text>Số: {x.phone}</Text>
//                               <Text>
//                                 Bắt đầu:{' '}
//                                 {new Date(x.startedAt).toLocaleString()}
//                               </Text>
//                               <Text>
//                                 Kết thúc (ước lượng):{' '}
//                                 {x.endedAt
//                                   ? new Date(x.endedAt).toLocaleString()
//                                   : '—'}
//                               </Text>
//                               <Text>
//                                 Thời lượng (ước lượng):{' '}
//                                 {x.durationMs != null
//                                   ? Math.round(x.durationMs / 1000) + 's'
//                                   : '—'}
//                               </Text>
//                               <Text style={{color: '#6b7280'}}>
//                                 Trạng thái: {x.status}
//                               </Text>
//                             </View>
//                           ))}
//                       </View>
//                     )}
//                   </View>
//                 )}

//                 <TouchableOpacity
//                   onPress={() => setShowHistory(false)}
//                   style={[
//                     ui.btn,
//                     {backgroundColor: colors.blue, marginTop: scale(14)},
//                   ]}>
//                   <Text style={ui.btnText}>Đóng</Text>
//                 </TouchableOpacity>
//               </Pressable>
//             </ScrollView>
//           </Pressable>
//         </Modal>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// /* ================== styles ================== */
// const ui = StyleSheet.create({
//   safeArea: {flex: 1, backgroundColor: colors.white},
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   card: {
//     width: CARD_W,
//     height: CARD_H,
//     borderRadius: scale(16),
//     padding: scale(14),
//     marginBottom: scale(16),
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: {width: 0, height: 4},
//     elevation: 3,
//   },
//   cardTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: scale(8),
//   },
//   icon: {fontSize: scale(22), marginRight: scale(6)},
//   title: {
//     fontSize: fontSize.size14,
//     color: colors.gray700,
//     fontFamily: 'Inter-Medium',
//   },
//   main: {
//     fontSize: fontSize.size18,
//     color: colors.black,
//     fontFamily: 'Inter-Bold',
//   },
//   sub: {
//     fontSize: fontSize.size13,
//     color: colors.gray600,
//     marginTop: scale(2),
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.35)',
//     justifyContent: 'center',
//     padding: scale(20),
//   },
//   modalCard: {
//     borderRadius: scale(16),
//     padding: scale(18),
//   },
//   modalTitle: {
//     fontSize: fontSize.size18,
//     color: colors.black,
//     fontFamily: 'Inter-SemiBold',
//     marginBottom: scale(12),
//   },
//   btn: {
//     marginTop: scale(8),
//     borderRadius: scale(10),
//     height: scale(44),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnText: {
//     color: colors.white,
//     fontFamily: 'Inter-SemiBold',
//     fontSize: fontSize.size15,
//   },
// });

// export default InfoVersionScreen;
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Modal,
  Dimensions,
  Pressable,
  Platform,
  Text,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  PermissionsAndroid,
  ActionSheetIOS,
  AppState,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import Clipboard from '@react-native-clipboard/clipboard';
import CallLogs from 'react-native-call-log'; // Android
import {translateLang} from '../../store/accLanguages/slide';
import {colors, fontSize} from '../../themes';
import {scale} from '../../utils/resolutions';
import {HeaderBack} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  startCallObserver,
  stopCallObserver,
  addCallChangedListener,
  getBufferedEventsAndClear,
} from '../../native/callObserver'; // sửa đường dẫn đúng dự án của bạn
import Config from 'react-native-config';
/* ================== helpers ================== */
const {width, height} = Dimensions.get('window');
const CARD_W = (width - scale(48)) / 2;
const CARD_H = Math.max(scale(140), (height - scale(300)) / 3);

const pct = (num, den) =>
  num || den ? `${Math.round(((num || 0) / (den || 1)) * 100)}%` : '—';
const safe = v => (v === null || v === undefined || v === '' ? '—' : String(v));
const getOsIcon = name => {
  const n = (name || '').toLowerCase();
  if (n.includes('ios')) return '🍎';
  if (n.includes('android')) return '🤖';
  return '📱';
};
const getNetworkIcon = type =>
  type === 'wifi' ? '📶' : type === 'cellular' ? '📡' : '🌐';

const fmtDuration = s => {
  const sec = Number(s || 0);
  if (!sec) return '0s';
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return m ? `${m}m ${r}s` : `${r}s`;
};
const fmtDateTime = ms => {
  const t = Number(ms || 0);
  if (!t) return '—';
  return new Date(t).toLocaleString();
};

// Chuẩn hoá & so khớp số theo "thuê bao core"
const digitsOnly = s => (s || '').replace(/\D/g, '');
const toSubscriberCore = raw => {
  let s = digitsOnly(raw);
  if (s.startsWith('00')) s = s.slice(2);
  if (s.startsWith('84')) s = s.slice(2);
  if (s.startsWith('0')) s = s.slice(1);
  return s;
};
const isSameSubscriber = (a, b) => {
  const A = toSubscriberCore(a),
    B = toSubscriberCore(b);
  if (!A || !B) return false;
  if (A === B) return true;
  const tail = (s, n) => s.slice(-n);
  return tail(A, 9) === tail(B, 9) || tail(A, 8) === tail(B, 8);
};

// Trạng thái text cho call log (nhà mạng)
const callStatusText = call => {
  if (!call) return 'Không xác định';
  const typeStr = String(call.type || '').toUpperCase();
  const raw = Number(call.rawType);
  const isOutgoing = raw === 2 || typeStr === 'OUTGOING';
  const isIncoming = raw === 1 || typeStr === 'INCOMING';
  const isMissed = raw === 3 || typeStr === 'MISSED';
  const isRejected = raw === 5 || typeStr === 'REJECTED';
  const isUnknown = raw === 6 || typeStr === 'UNKNOWN';

  if (isOutgoing)
    return call.duration > 0 ? 'Đã gọi thành công' : 'Gọi đi (không bắt máy)';
  if (isIncoming)
    return call.duration > 0
      ? 'Cuộc gọi đến (đã nghe)'
      : 'Cuộc gọi đến (bỏ lỡ)';
  if (isMissed) return 'Cuộc gọi nhỡ';
  if (isRejected) return 'Cuộc gọi bị từ chối';
  if (isUnknown) return 'Không rõ trạng thái';
  return 'Khác';
};
const statusColor = call => {
  const s = callStatusText(call);
  if (s.includes('thành công') || s.includes('đã nghe')) return '#0a7f2e';
  if (s.includes('nhỡ') || s.includes('không bắt')) return '#b00020';
  if (s.includes('không rõ') || s.includes('từ chối')) return '#6b7280';
  return '#111827';
};

// Zalo status labels (xác nhận thủ công)
const labelExternalStatus = s => {
  switch (s) {
    case 'thanh_cong':
      return 'Thành công';
    case 'khong_bat_may':
      return 'Không bắt máy';
    case 'khong_lien_lac':
      return 'Không liên lạc được';
    case 'huy':
      return 'Huỷ';
    default:
      return '—';
  }
};
const colorExternalStatus = s => {
  if (s === 'thanh_cong') return '#0a7f2e';
  if (s === 'khong_bat_may' || s === 'khong_lien_lac') return '#b00020';
  if (s === 'huy') return '#6b7280';
  return '#111827';
};

/* ================== Tile Component ================== */
const Tile = ({icon, title, main, sub, color, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    style={[ui.card, {backgroundColor: color}]}>
    <View style={ui.cardTop}>
      <Text style={ui.icon}>{icon}</Text>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[ui.title, {width: scale(120)}]}>
        {title}
      </Text>
    </View>
    <Text style={ui.main} numberOfLines={1}>
      {main}
    </Text>
    {!!sub && (
      <Text style={ui.sub} numberOfLines={1}>
        {sub}
      </Text>
    )}
  </TouchableOpacity>
);

/* ================== Main Screen ================== */
const InfoVersionScreen = ({navigation}) => {
  const languageKey = useSelector(translateLang);
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState({});
  const [device, setDevice] = useState({});
  const [network, setNetwork] = useState({});
  const [powerMem, setPowerMem] = useState({});
  const [detailKey, setDetailKey] = useState(null);

  // Android: lịch sử nhà mạng cho số đang xem
  const [showHistory, setShowHistory] = useState(false);
  const [callHistory, setCallHistory] = useState([]);

  // Zalo (xác nhận thủ công)
  const [externalCalls, setExternalCalls] = useState([]);
  const [pendingExternal, setPendingExternal] = useState(null);
  const pendingRef = useRef(null);

  // iOS: CallKit events (quan sát tel:)
  const CallObserver = NativeModules.CallObserver;
  const callObsEmitter = CallObserver
    ? new NativeEventEmitter(CallObserver)
    : null;
  const callEventsRef = useRef([]); // lưu event trong lần gọi hiện tại

  // app state ref
  const appStateRef = useRef(AppState.currentState);

  /* ==== Thu thập thông tin thiết bị ==== */
  const collect = useCallback(async () => {
    setLoading(true);
    try {
      const appName = DeviceInfo.getApplicationName();
      const version = DeviceInfo.getVersion();
      const buildNumber = DeviceInfo.getBuildNumber();
      const readableVersion = DeviceInfo.getReadableVersion();
      const bundleId = DeviceInfo.getBundleId();
      setApp({appName, version, buildNumber, readableVersion, bundleId});

      const brand = DeviceInfo.getBrand();
      const model = DeviceInfo.getModel();
      const deviceName = await DeviceInfo.getDeviceName();
      const systemName = DeviceInfo.getSystemName();
      const systemVersion = DeviceInfo.getSystemVersion();
      const isEmulator = await DeviceInfo.isEmulator();
      const totalMem = await DeviceInfo.getTotalMemory();
      let usedMem = null;
      try {
        usedMem = await DeviceInfo.getUsedMemory();
      } catch {}
      const totalDisk = await DeviceInfo.getTotalDiskCapacity();
      const freeDisk = await DeviceInfo.getFreeDiskStorage();
      setDevice({
        brand,
        model,
        deviceName,
        systemName,
        systemVersion,
        isEmulator,
        totalMem,
        usedMem,
        totalDisk,
        freeDisk,
      });

      let batteryLevel = null,
        isCharging = null;
      try {
        batteryLevel = await DeviceInfo.getBatteryLevel();
        isCharging = await DeviceInfo.isBatteryCharging();
      } catch {}
      setPowerMem({batteryLevel, isCharging});

      const net = await NetInfo.fetch();
      const {type, isConnected, isInternetReachable, details = {}} = net || {};
      const {ssid, carrier} = details || {};
      setNetwork({type, isConnected, isInternetReachable, ssid, carrier});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    collect();
  }, [collect]);
  useEffect(() => {
    pendingRef.current = pendingExternal;
  }, [pendingExternal]);

  const usedDisk =
    device.totalDisk && device.freeDisk
      ? device.totalDisk - device.freeDisk
      : null;

  const tiles = [
    {
      key: 'app',
      icon: '🧩',
      title: 'Ứng dụng',
      main: safe(app.readableVersion),
      sub:
        Config.API_URL ===
        'https://devapicontrol-dms.kimtingroup.com:44361/api/'
          ? 'DEV eSales'
          : ' UAT eSales',
      color: '#E3F2FD',
    },
    {
      key: 'device',
      icon: getOsIcon(device.systemName || Platform.OS),
      title: ` ${safe(device.model)}`,
      main: `${safe(device.systemName)} ${safe(device.systemVersion)}`,
      sub: device.isEmulator ? '(Giả lập)' : safe(device.deviceName),
      color: '#E8F5E9',
    },
    {
      key: 'memory',
      icon: '🧠',
      title: 'Bộ nhớ',
      main:
        device.usedMem && device.totalMem
          ? pct(device.usedMem, device.totalMem)
          : '—',
      sub:
        usedDisk && device.totalDisk
          ? `Lưu trữ: ${pct(usedDisk, device.totalDisk)}`
          : '—',
      color: '#FFF8E1',
    },
    {
      key: 'network',
      icon: getNetworkIcon(network.type),
      title: 'Kết nối',
      main: network.isConnected
        ? network.type === 'wifi'
          ? `Wi-Fi ${safe(network.ssid)}`
          : `Di động ${safe(network.carrier)}`
        : 'Mất kết nối',
      sub:
        typeof network.isInternetReachable === 'boolean'
          ? network.isInternetReachable
            ? 'Internet OK'
            : 'Không có mạng'
          : '—',
      color: '#E1F5FE',
    },
    {
      key: 'battery',
      icon: '🔋',
      title: 'Pin',
      main:
        typeof powerMem.batteryLevel === 'number'
          ? `${Math.round(powerMem.batteryLevel * 100)}%`
          : '—',
      sub: powerMem.isCharging ? 'Đang sạc' : 'Không sạc',
      color: '#FFF3E0',
    },
    {
      key: 'actions',
      icon: '🧾',
      title: 'Báo cáo',
      main: 'Sao chép nhanh',
      sub: 'JSON chẩn đoán',
      color: '#EDE7F6',
      onPress: () => {
        Clipboard.setString(JSON.stringify({app, device, network, powerMem}));
        Alert.alert('Đã sao chép thông tin');
      },
    },
  ];

  /* ==== Liên hệ ==== */
  const toE164 = (raw, countryCode = '84') => {
    const digits = (raw || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('0')) return `+${countryCode}${digits.slice(1)}`;
    if (digits.startsWith(countryCode)) return `+${digits}`;
    if (digits.startsWith(`+${countryCode}`)) return digits;
    return `+${countryCode}${digits}`;
  };

  const openDialer = async phone => {
    const url = `tel:${phone}`;
    const can = await Linking.canOpenURL(url);
    if (can) return Linking.openURL(url);
    Alert.alert('Không thể mở Phone app');
  };

  const openZaloCore = async raw => {
    const phone = (raw || '').replace(/\D/g, '');
    const candidates = [`zalo://chat?phone=${phone}`, `zalo://qr/p/${phone}`];
    for (const url of candidates) {
      try {
        if (await Linking.canOpenURL(url)) {
          await Linking.openURL(url);
          return true;
        }
      } catch {}
    }
    const webUrl = `https://zalo.me/${phone}`;
    try {
      await Linking.openURL(webUrl);
      return true;
    } catch {
      Alert.alert('Không mở được Zalo');
      return false;
    }
  };

  // --- Zalo: xác nhận thủ công ---
  const addExternalEntry = ({type, phone, startedAt, endedAt, status}) => {
    const id = `${type}-${Date.now()}`;
    setExternalCalls(prev =>
      prev.concat({
        id,
        type,
        phone,
        startedAt,
        endedAt,
        durationMs: Math.max(0, (endedAt || Date.now()) - startedAt),
        status,
      }),
    );
    setShowHistory(true); // mở modal để thấy luôn
  };

  const confirmZaloOutcome = ({type, phone, startedAt}) => {
    Alert.alert(
      'Kết quả Zalo',
      `Bạn đã gọi cho ${phone}?`,
      [
        {
          text: 'Huỷ',
          style: 'cancel',
          onPress: () =>
            addExternalEntry({
              type,
              phone,
              startedAt,
              endedAt: Date.now(),
              status: 'huy',
            }),
        },
        {
          text: 'Không liên lạc được',
          onPress: () =>
            addExternalEntry({
              type,
              phone,
              startedAt,
              endedAt: Date.now(),
              status: 'khong_lien_lac',
            }),
        },
        {
          text: 'Không bắt máy',
          onPress: () =>
            addExternalEntry({
              type,
              phone,
              startedAt,
              endedAt: Date.now(),
              status: 'khong_bat_may',
            }),
        },
        {
          text: 'Thành công',
          onPress: () =>
            addExternalEntry({
              type,
              phone,
              startedAt,
              endedAt: Date.now(),
              status: 'thanh_cong',
            }),
        },
      ],
      {cancelable: true},
    );
  };

  const openZaloWithLogging = async raw => {
    const phone = (raw || '').replace(/\D/g, '');
    const startedAt = Date.now();
    const pending = {type: 'zalo', phone, startedAt};
    setPendingExternal(pending);
    pendingRef.current = pending;

    const sub = AppState.addEventListener('change', state => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        state === 'active'
      ) {
        const endedAt = Date.now();
        const spent = endedAt - (pendingRef.current?.startedAt || startedAt);
        const MIN_SPENT_MS = 3000; // chỉ hỏi nếu ở ngoài >= 3s
        const pen = pendingRef.current;
        if (spent >= MIN_SPENT_MS && pen && pen.type === 'zalo') {
          confirmZaloOutcome({
            type: 'zalo',
            phone: pen.phone,
            startedAt: pen.startedAt,
          });
        }
        setPendingExternal(null);
        pendingRef.current = null;
        sub.remove();
      }
      appStateRef.current = state;
    });

    const ok = await openZaloCore(raw);
    if (!ok) {
      setPendingExternal(null);
      pendingRef.current = null;
      try {
        sub.remove();
      } catch {}
    }
  };

  // --- Android: đọc CallLog sau khi quay lại ---
  const requestCallLogPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };
  const fetchRecentCallsFor = async rawNumber => {
    if (Platform.OS !== 'android') return [];
    const ok = await requestCallLogPermission();
    if (!ok) return [];
    let logs = [];
    try {
      logs = await CallLogs.load(30);
    } catch {
      return [];
    }
    const now = Date.now();
    const timeWindowMs = 6 * 60 * 60 * 1000; // 6 giờ
    return (logs || [])
      .filter(l => {
        const ms = Number(l?.timestamp || l?.dateTime || 0);
        const recent = ms && now - ms <= timeWindowMs;
        return recent && isSameSubscriber(l?.phoneNumber, rawNumber);
      })
      .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
  };

  // --- iOS: theo dõi kết quả cuộc gọi tel: bằng CallKit ---
  const startIOSCallObserver = () => {
    if (!CallObserver || !callObsEmitter) return {remove: () => {}};
    callEventsRef.current = [];
    const sub = callObsEmitter.addListener('callChanged', evt => {
      // evt: { timestamp, uuid, isOutgoing, hasConnected, hasEnded }
      callEventsRef.current.push(evt);
    });
    try {
      CallObserver.start();
    } catch {}
    return {
      remove: () => {
        try {
          sub.remove();
        } catch {}
        try {
          CallObserver.stop();
        } catch {}
      },
    };
  };

  const deduceIOSOutcome = () => {
    // Quy ước đơn giản: nếu có outgoing && hasConnected => "đã kết nối"
    // nếu chỉ outgoing mà không connected => "không kết nối/không bắt máy"
    const evts = callEventsRef.current || [];
    const anyOutgoing = evts.some(e => e.isOutgoing);
    const anyConnected = evts.some(e => e.hasConnected);
    return {anyOutgoing, anyConnected};
  };

  // === Nhấn số điện thoại ===
  const rawPhone = '0978709369'; // thay bằng số thực tế
  const e164 = toE164(rawPhone, '84');

  const handlePressPhone = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {options: ['Huỷ', 'Gọi điện', 'Zalo'], cancelButtonIndex: 0},
        async idx => {
          switch (idx) {
            case 1: {
              // iOS: bật observer, mở dialer, khi quay lại thì suy luận
              const obs = startIOSCallObserver();
              const sub = AppState.addEventListener('change', state => {
                if (
                  appStateRef.current.match(/inactive|background/) &&
                  state === 'active'
                ) {
                  const {anyOutgoing, anyConnected} = deduceIOSOutcome();
                  obs.remove();

                  // Tạo một entry "ước lượng theo CallKit" để show trong modal
                  const entry = {
                    phoneNumber: e164,
                    timestamp: Date.now(),
                    duration: anyConnected ? 1 : 0, // không biết duration thật; 1s để biểu diễn "đã kết nối"
                    name: null,
                    rawType: anyOutgoing ? 2 : 0,
                    type: anyOutgoing
                      ? anyConnected
                        ? 'OUTGOING'
                        : 'OUTGOING'
                      : 'UNKNOWN',
                    _iosCallKit: true,
                    _iosConnected: anyConnected,
                  };
                  setCallHistory(prev => [entry, ...prev]);

                  setShowHistory(true);

                  sub.remove();
                }
                appStateRef.current = state;
              });
              // await openDialer(e164); Thay vì gọi hàm openDialer(e164); cũ, đổi sang:
              await openDialerWithPending(e164);

              break;
            }
            case 2:
              await openZaloWithLogging(rawPhone);
              break;
          }
        },
      );
    } else {
      Alert.alert('Liên hệ', rawPhone, [
        {text: 'Zalo', onPress: () => openZaloWithLogging(rawPhone)},
        {
          text: 'Gọi điện',
          onPress: async () => {
            const sub = AppState.addEventListener('change', async state => {
              if (
                appStateRef.current.match(/inactive|background/) &&
                state === 'active'
              ) {
                const history = await fetchRecentCallsFor(rawPhone);
                if (!history.length) {
                  Alert.alert('Cuộc gọi', 'Không tìm thấy bản ghi phù hợp');
                } else {
                  setCallHistory(history);
                  setShowHistory(true);
                }
                sub.remove();
              }
              appStateRef.current = state;
            });
            await openDialer(e164);
          },
        },
        {text: 'Huỷ', style: 'cancel'},
      ]);
    }
  };
  const openDialerWithPending = async e164 => {
    // Lưu pending để nếu user KHÔNG quay lại ngay, lần sau mở app vẫn khôi phục được
    await AsyncStorage.setItem(
      '@pending_call',
      JSON.stringify({
        type: 'tel',
        phone: e164,
        startedAt: Date.now(),
      }),
    );

    // Bật CallKit observer (iOS) để nhận event nếu app vẫn còn sống
    if (Platform.OS === 'ios') startCallObserver();

    const url = `tel:${e164}`;
    const can = await Linking.canOpenURL(url);
    if (can) await Linking.openURL(url);
  };

  useEffect(() => {
    const handleResume = async () => {
      // 1) lấy pending (nếu có)
      const raw = await AsyncStorage.getItem('@pending_call');
      if (raw) {
        const pending = JSON.parse(raw);
        await AsyncStorage.removeItem('@pending_call');

        // 2) lấy CallKit buffered events từ native (nếu có)
        const events = await getBufferedEventsAndClear();

        // 3) suy luận kết quả: nếu có event gần thời điểm startedAt với outgoing+connected => coi như kết nối
        const WINDOW_MS = 20000; // ±20s
        const near = (events || []).filter(
          e => Math.abs((e?.timestamp || 0) - pending.startedAt) <= WINDOW_MS,
        );
        const connected = near.some(e => e?.isOutgoing && e?.hasConnected);

        // 4) thêm bản ghi vào lịch sử (functional update)
        setCallHistory(prev => [
          {
            phoneNumber: pending.phone,
            timestamp: pending.startedAt,
            duration: connected ? 1 : 0, // iOS không có duration thật
            type: 'OUTGOING',
            _iosCallKit: true,
            _iosConnected: connected,
            _resumeAfterKill: true,
          },
          ...prev,
        ]);

        // tuỳ chọn: hỏi xác nhận cho chắc
        // Alert.alert('Xác nhận', `Bạn đã gọi thành công tới ${pending.phone}?`, ... );
      }
    };

    // chạy khi cold start
    handleResume();

    // chạy mỗi khi app quay lại foreground
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') handleResume();
    });

    return () => sub.remove();
  }, []);

  /* ==== Render ==== */
  return (
    <LinearGradient
      colors={['#fff', '#fff']}
      style={{flex: 1}}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}>
      <StatusBar
        animated
        barStyle="dark-content"
        backgroundColor={colors.white}
        translucent={false}
      />
      <SafeAreaView style={ui.safeArea}>
        <HeaderBack
          title={languageKey('_version')}
          onPress={() => navigation.goBack()}
        />

        <ScrollView
          contentContainerStyle={{padding: scale(16), paddingBottom: scale(60)}}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={collect} />
          }>
          <View style={ui.grid}>
            {tiles.map((t, i) => (
              <Tile
                key={i}
                {...t}
                onPress={() => (t.onPress ? t.onPress() : setDetailKey(t.key))}
              />
            ))}
          </View>
        </ScrollView>

        {/* Số điện thoại */}
        {/* <TouchableOpacity onPress={handlePressPhone} activeOpacity={0.7}>
          <Text style={{padding: 12, fontWeight: '600', color: colors.blue}}>
            {rawPhone}
          </Text>
        </TouchableOpacity> */}

        {/* Modal lịch sử */}
        <Modal
          transparent
          visible={showHistory}
          animationType="slide"
          onRequestClose={() => setShowHistory(false)}>
          <Pressable
            style={ui.modalBackdrop}
            onPress={() => setShowHistory(false)}>
            <Pressable
              style={[ui.modalCard, {backgroundColor: colors.white}]}
              onPress={e => e.stopPropagation()}>
              <Text style={ui.modalTitle}>Lịch sử: {rawPhone}</Text>

              <View style={{gap: scale(8)}}>
                {/* Android call log + iOS CallKit estimated entries */}
                {callHistory.map((c, idx) => (
                  <View
                    key={`${c.timestamp || idx}`}
                    style={{
                      paddingVertical: scale(8),
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: '#eee',
                    }}>
                    <Text style={{fontWeight: '600'}}>
                      {c.phoneNumber ? `Số: ${c.phoneNumber}` : 'Số: —'}
                    </Text>
                    <Text>Thời gian: {fmtDateTime(c?.timestamp)}</Text>
                    {/* Android có duration thật; iOS estimated dùng 1s nếu connected */}
                    {'duration' in c && (
                      <Text>Thời lượng: {fmtDuration(c?.duration)}</Text>
                    )}
                    {!!c?._iosCallKit && (
                      <Text
                        style={{
                          color: c._iosConnected ? '#0a7f2e' : '#b00020',
                        }}>
                        iOS CallKit:{' '}
                        {c._iosConnected
                          ? 'Đã kết nối (ước lượng)'
                          : 'Không kết nối (ước lượng)'}
                      </Text>
                    )}
                    {!!c?.name && <Text>Danh bạ: {c.name}</Text>}
                    {!c?._iosCallKit && (
                      <Text style={{marginTop: 2, color: statusColor(c)}}>
                        Trạng thái: {callStatusText(c)}
                      </Text>
                    )}
                  </View>
                ))}

                {/* Lịch sử thao tác Zalo (xác nhận thủ công) */}
                {!!externalCalls.length && (
                  <View style={{marginTop: scale(12)}}>
                    <Text style={{fontWeight: '700', marginBottom: scale(6)}}>
                      Zalo (xác nhận)
                    </Text>
                    {externalCalls
                      .filter(
                        x =>
                          x.type === 'zalo' &&
                          isSameSubscriber(x.phone, rawPhone),
                      )
                      .sort((a, b) => b.startedAt - a.startedAt)
                      .slice(0, 10)
                      .map(x => (
                        <View
                          key={x.id}
                          style={{
                            paddingVertical: scale(8),
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: '#eee',
                          }}>
                          <Text>Số: {x.phone}</Text>
                          <Text>
                            Bắt đầu: {new Date(x.startedAt).toLocaleString()}
                          </Text>
                          <Text>
                            Kết thúc:{' '}
                            {x.endedAt
                              ? new Date(x.endedAt).toLocaleString()
                              : '—'}
                          </Text>
                          <Text>
                            Thời lượng (ước lượng):{' '}
                            {x.durationMs != null
                              ? Math.round(x.durationMs / 1000) + 's'
                              : '—'}
                          </Text>
                          <Text style={{color: colorExternalStatus(x.status)}}>
                            Trạng thái: {labelExternalStatus(x.status)}
                          </Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setShowHistory(false)}
                style={[
                  ui.btn,
                  {backgroundColor: colors.blue, marginTop: scale(14)},
                ]}>
                <Text style={ui.btnText}>Đóng</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

/* ================== styles ================== */
const ui = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.white},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: scale(16),
    padding: scale(14),
    marginBottom: scale(16),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  cardTop: {flexDirection: 'row', alignItems: 'center', marginBottom: scale(8)},
  icon: {fontSize: scale(22), marginRight: scale(6)},
  title: {
    fontSize: fontSize.size14,
    color: colors.gray700,
    fontFamily: 'Inter-Medium',
  },
  main: {
    fontSize: fontSize.size18,
    color: colors.black,
    fontFamily: 'Inter-Bold',
  },
  sub: {fontSize: fontSize.size13, color: colors.gray600, marginTop: scale(2)},
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: scale(20),
  },
  modalCard: {borderRadius: scale(16), padding: scale(18)},
  modalTitle: {
    fontSize: fontSize.size18,
    color: colors.black,
    fontFamily: 'Inter-SemiBold',
    marginBottom: scale(12),
  },
  btn: {
    marginTop: scale(8),
    borderRadius: scale(10),
    height: scale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.size15,
  },
});

export default InfoVersionScreen;
