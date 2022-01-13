import Modal from '@components/Modal';
import React, { useCallback, VFC } from 'react';
import { Button, Input, Label } from '@pages/Signup/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { BASE_URL, getUserFetcher } from '@utils/fetcher';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { IUser } from '@typings/db';
import useSWR from 'swr';

interface IInviteChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: VFC<IInviteChannelModalProps> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const [newMember, onChangenewMember, setnewMember] = useInput('');
  const { workspace, channels } = useParams<{ workspace: string; channels: string }>();
  const { mutate } = useSWR<IUser[] | false>(
    `/api/workspaces/${workspace}/channels/${channels}/members`,
    getUserFetcher,
  );

  const onInviteMember = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        toast.error('이메일을 입력하세요', { position: 'top-center' });
        return;
      }
      axios
        .post(
          `${BASE_URL}/api/workspaces/${workspace}/channels/${channels}/members`,
          {
            email: newMember,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data, { position: 'top-center' });
        });
      setShowInviteChannelModal(false);
      setnewMember('');
    },
    [newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="channelMember-label">
          <span>이메일</span>
          <Input id="channelMember" value={newMember} onChange={onChangenewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
