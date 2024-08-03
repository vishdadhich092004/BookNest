import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import NewDiscussion from "./pages/Discussion/NewDiscussion";
import AllDiscussions from "./pages/Discussion/AllDiscussions";
import PrivateRoute from "./components/PrivateRoute";
import SingleDiscussion from "./pages/Discussion/SingleDiscussion";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path="/discussions/new"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <NewDiscussion />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/discussions"
          element={
            <Layout>
              <AllDiscussions />
            </Layout>
          }
        />
        <Route
          path="/discussions/:id"
          element={
            <Layout>
              <SingleDiscussion />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
