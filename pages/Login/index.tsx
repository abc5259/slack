import useInput from '@hooks/useInput';
import { Redirect } from 'react-router';
import { BASE_URL, getUserFetcher } from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '../Signup/styles';
const LogIn = () => {
  const { data: userData, error, mutate } = useSWR('/api/users', getUserFetcher);
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          `${BASE_URL}/api/users/login`,
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate(); //원할때 swr호출하기
        })
        .catch((error) => {
          setLogInError(error.response?.data?.code === 401);
        });
    },
    [email, password],
  );

  if (userData === undefined) {
    return <div>로딩중...</div>;
  }

  if (!error && userData) {
    console.log('로그인됨', userData);
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
