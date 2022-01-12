import Modal from '@components/Modal';
import React, { useCallback, VFC } from 'react';
import { Button, Input, Label } from '@pages/Signup/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { BASE_URL } from '@utils/fetcher';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';

interface ICreateChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateWorkspaceModal: (flag: boolean) => void;
  mutate: KeyedMutator<any>;
}

const CreateWorkspaceModal: VFC<ICreateChannelModalProps> = ({
  show,
  onCloseModal,
  setShowCreateWorkspaceModal,
  mutate,
}) => {
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const onCreateWorkspace = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(`${BASE_URL}/api/workspaces`, { workspace: newWorkspace, url: newUrl }, { withCredentials: true })
        .then(() => mutate())
        .catch((error) => {
          console.error(error.response.data);
          toast.error('다시 시도해 주세요!', { position: 'top-center' });
        });
      setShowCreateWorkspaceModal(false);
      setNewWorkspace('');
      setNewUrl('');
    },
    [newWorkspace, newUrl],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateWorkspace}>
        <Label id="workspace-label">
          <span>워크스페이스 이름</span>
          <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
        </Label>
        <Label id="workspace-url-label">
          <span>워크스페이스 url</span>
          <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
        </Label>
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
