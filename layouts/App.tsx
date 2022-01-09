import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import loadable from '@loadable/component';
// 코드 스플릿팅
const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/Signup'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};

export default App;
