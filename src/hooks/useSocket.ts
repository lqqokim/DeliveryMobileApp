import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';

let socket: Socket | undefined;
const useSocket = (): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) {
    socket = io(Config.API_URL, {
      // transports: ['long-polling', 'websocket'],
      transports: ['websocket'],
      path: '/socket.io',
    });
  }
  return [socket, disconnect];
};

export default useSocket;

/**
 * socket.io 는 소켓통신을 지원하지 않는 브라우저에서는 long-polling 방식을 적용하여 계속적으로 요청을 보낼 수 있도록 변환해준다.
 *
 */
