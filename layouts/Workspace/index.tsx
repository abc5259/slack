import { BASE_URL, getUserFetcher } from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState, VFC } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
import gravatar from 'gravatar';
import { IChannel, IUser } from '@typings/db';
import useSWR from 'swr';
import {
  Header,
  AddButton,
  Channels,
  Chats,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import CreateChannelModal from '@components/CreateChannelModal';
import CreateWorkspaceModal from '@components/CreateWorkspaceModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', getUserFetcher);
  const { data: channelData } = useSWR<IChannel[] | false>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    getUserFetcher,
  );

  const onLogout = useCallback(() => {
    axios
      .post(`${BASE_URL}/api/users/logout`, null, { withCredentials: true })
      .then(() => mutate())
      .catch((error) => console.log(error.response.data));
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  if (!userData && !error) {
    return <Redirect to="/login"></Redirect>;
  }

  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span>
              <ProfileImg
                onClick={onClickUserProfile}
                src={gravatar.url(userData.email, { s: '28px', d: 'retro' })}
                alt={userData.nickname}
              />
              {showUserMenu && (
                <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                  <ProfileModal>
                    <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                    <div>
                      <span id="profile-name">{userData.nickname}</span>
                      <span id="profile-active">Active</span>
                    </div>
                  </ProfileModal>
                  <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                </Menu>
              )}
            </span>
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData &&
            userData.Workspaces.map((workspace) => {
              return (
                <Link key={workspace.id} to={`/workspace/${workspace.id}/channel`}>
                  <WorkspaceButton>{workspace.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                </Link>
              );
            })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Slect</WorkspaceName>
          <MenuScroll>
            {showWorkspaceModal && (
              <Menu style={{ top: 95, left: 80 }} show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal}>
                <WorkspaceModal>
                  <h2>Sleack</h2>
                  <button onClick={onClickInviteWorkspace}>초대하기</button>
                  <button onClick={onClickAddChannel}>채널 만들기</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
              </Menu>
            )}
            {channelData &&
              channelData.map((channel) => {
                return <div key={channel.id}>{channel.name}</div>;
              })}
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <CreateWorkspaceModal
        show={showCreateWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowCreateWorkspaceModal={setShowCreateWorkspaceModal}
        mutate={mutate}
      />
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
        mutate={mutate}
      />
    </div>
  );
};

export default Workspace;
