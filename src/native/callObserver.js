// import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

// const {CallObserver} = NativeModules;

// let emitter = null;

// export const startCallObserver = () => {
//   if (Platform.OS !== 'ios' || !CallObserver) return;
//   if (!emitter) emitter = new NativeEventEmitter(CallObserver);
//   try {
//     CallObserver.start();
//   } catch (e) {}
// };

// export const stopCallObserver = () => {
//   if (Platform.OS !== 'ios' || !CallObserver) return;
//   try {
//     CallObserver.stop();
//   } catch (e) {}
// };

// export const addCallChangedListener = cb => {
//   if (Platform.OS !== 'ios' || !CallObserver) return {remove: () => {}};
//   if (!emitter) emitter = new NativeEventEmitter(CallObserver);
//   const sub = emitter.addListener('callChanged', cb);
//   return {remove: () => sub.remove()};
// };
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

const {CallObserver} = NativeModules || {};
let emitter = null;

export const startCallObserver = () => {
  if (Platform.OS !== 'ios' || !CallObserver) return;
  if (!emitter) emitter = new NativeEventEmitter(CallObserver);
  try {
    CallObserver.start();
  } catch (e) {}
};

export const stopCallObserver = () => {
  if (Platform.OS !== 'ios' || !CallObserver) return;
  try {
    CallObserver.stop();
  } catch (e) {}
};

export const addCallChangedListener = cb => {
  if (Platform.OS !== 'ios' || !CallObserver) return {remove: () => {}};
  if (!emitter) emitter = new NativeEventEmitter(CallObserver);
  const sub = emitter.addListener('callChanged', cb);
  return {remove: () => sub.remove()};
};

export const getBufferedEventsAndClear = async () => {
  if (Platform.OS !== 'ios' || !CallObserver?.getBufferedEventsAndClear)
    return [];
  try {
    const events = await CallObserver.getBufferedEventsAndClear();
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
};
