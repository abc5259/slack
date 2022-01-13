import React, { useCallback } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import { IDM, IUser } from '@typings/db';
import useSWR from 'swr';
import { BASE_URL, getUserFetcher } from '@utils/fetcher';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { toast } from 'react-toastify';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, getUserFetcher);
  const { data: myData } = useSWR<IUser>(`/api/users`, getUserFetcher);
  const { data: chatData, mutate } = useSWR<IDM>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    getUserFetcher,
  );
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`${BASE_URL}/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutate();
            setChat('');
          })
          .catch((error) => {
            console.error(error);
            toast.error(error.response.data);
          });
      }
    },
    [chat],
  );

  if (!userData || !myData) {
    return null;
  }
  return (
    <>
      <Container>
        <Header>
          <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
          <span>{userData.nickname}</span>
        </Header>
        <ChatList />
        <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      </Container>
    </>
  );
};

export default DirectMessage;
