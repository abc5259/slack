import React, { useCallback } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import { IUser } from '@typings/db';
import useSWR from 'swr';
import { getUserFetcher } from '@utils/fetcher';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, getUserFetcher);
  const { data: myData } = useSWR<IUser>(`/api/users`, getUserFetcher);
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();
      setChat('');
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
