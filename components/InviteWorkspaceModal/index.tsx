import Modal from '@components/Modal';
import React, { useCallback, VFC } from 'react';
import { Button, Input, Label } from '@pages/Signup/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { BASE_URL } from '@utils/fetcher';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';

interface IInviteWorkspaceModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
  mutate: KeyedMutator<any>;
}

const InviteWorkspaceModal: VFC<IInviteWorkspaceModalProps> = ({
  show,
  onCloseModal,
  setShowInviteWorkspaceModal,
  mutate,
}) => {
  const [newMember, onChangenewMember, setnewMember] = useInput('');
  const { workspace } = useParams<{ workspace: string }>();

  const onInviteMember = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        toast.error('이메일을 입력하세요', { position: 'top-center' });
        return;
      }
      axios
        .post(
          `${BASE_URL}/api/workspaces/${workspace}/members`,
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
      setShowInviteWorkspaceModal(false);
      setnewMember('');
    },
    [newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" value={newMember} onChange={onChangenewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
