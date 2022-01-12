import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import loadable from '@loadable/component';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
toast.configure();

// 코드 스플릿팅
const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/Signup'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
