import Modal from '@components/Modal';
import React, { useCallback, useState, VFC } from 'react';
import { Button, Input, Label } from '@pages/Signup/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { BASE_URL, getUserFetcher } from '@utils/fetcher';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel } from '@typings/db';

interface ICreateChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<ICreateChannelModalProps> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace } = useParams<{ workspace: string }>();
  const { mutate } = useSWR<IChannel[] | false>(`/api/workspaces/${workspace}/channels`, getUserFetcher);
  const onCreateChannel = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) {
        toast.error('내용을 입력하세요', { position: 'top-center' });
        return;
      }
      axios
        .post(
          `${BASE_URL}/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
          setShowCreateChannelModal(false);
          setNewChannel('');
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data, { position: 'top-center' });
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
