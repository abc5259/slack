import { BASE_URL } from '@utils/fetcher';
import axios from 'axios';
import io from 'socket.io-client';

const sockets = {};

const useSocket = (workspace?: string) => {
  if (!workspace) {
    return [];
  }
  sockets[workspace] = io.connect(`${BASE_URL}/ws-${workspace}`);
  sockets[workspace].emit('hello', 'world'); // hello라는 이벤트로 world라는 데이터를 보낸다
  sockets[workspace].on('message', (data) => {
    console.log(data);
  });
  sockets[workspace].on('data', (data) => {
    console.log(data);
  });
  sockets[workspace].on('onlineList', (data) => {
    console.log(data);
  });
  const disconnect = sockets[workspace].disconnect;

  return [sockets[workspace], disconnect];
};

export default useSocket;
