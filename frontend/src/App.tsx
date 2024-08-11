import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import NewDiscussion from "./pages/Discussion/NewDiscussion";
import AllDiscussions from "./pages/Discussion/AllDiscussions";
import PrivateRoute from "./components/PrivateRoute";
import SingleDiscussion from "./pages/Discussion/SingleDiscussion";
import NewComment from "./pages/Comment/NewComment";
import EditDiscussion from "./pages/Discussion/EditDiscussion";
import NewBook from "./pages/Book/NewBook";
import AllBooks from "./pages/Book/AllBooks";
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
        <Route
          path="/discussions/:discussionId/comments"
          element={
            <Layout>
              <NewComment />
            </Layout>
          }
        />
        <Route
          path="/discussions/:discussionId/edit"
          element={
            <Layout>
              <EditDiscussion />
            </Layout>
          }
        />
        <Route
          path="/books/new"
          element={
            <Layout>
              <NewBook />
            </Layout>
          }
        />
        <Route
          path="/books/"
          element={
            <Layout>
              <AllBooks />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
