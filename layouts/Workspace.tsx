import { getUserFetcher } from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', getUserFetcher, {
    dedupingInterval: 10000, //주기적으로 호출은 되지만 dedupingInterval 기간 내에는 캐시에서 불러와준다.
  });
  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, { withCredentials: true })
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
