import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './components/layout/Landing'
import Auth from './views/Auth'
import AuthContextProvider from "./contexts/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import About from "./views/About";
import PostContextProvider from "./contexts/PostContext";
import Main from "./Main";
import EmptyPage from './pages/EmptyPage';
function App() {

  return (
    <AuthContextProvider>
      <PostContextProvider>
        <Router>
          <Switch>
            {/* <Route exact path="/" component={Landing} /> */}
            <Route
              exact
              path="/login"
              render={(props) => <Auth {...props} authRoute="login" />}
            />
            <Route
              exact
              path="/register"
              render={(props) => <Auth {...props} authRoute="register" />}
            />
            <ProtectedRoute exact path="/dashboard" component={Main} />
            <ProtectedRoute exact path="/crud" component={Main} />
            <ProtectedRoute exact path="/empty" component={Main} />
            {/* <ProtectedRoute exact path="/timeline" component={Main} /> */}
            <ProtectedRoute exact path="/promotion" component={Main} />
            <ProtectedRoute exact path="/user" component={Main} />
            <ProtectedRoute exact path="/accept" component={Main} />
          </Switch>
        </Router>
      </PostContextProvider>
    </AuthContextProvider>
  );
}

export default App
