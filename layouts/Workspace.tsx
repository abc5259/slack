import { BASE_URL, getUserFetcher } from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('/api/users', getUserFetcher);
  const onLogout = useCallback(() => {
    axios
      .post(`${BASE_URL}/api/users/logout`, null, { withCredentials: true })
      .then((response) => mutate())
      .catch((error) => console.log(error.response.data));
  }, []);

  if (!data && !error) {
    return <Redirect to="/login"></Redirect>;
  }

  return (
    <>
      <button onClick={onLogout}>Workspace</button>
      {children}
    </>
  );
};

export default Workspace;
