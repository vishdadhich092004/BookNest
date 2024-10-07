import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Auth/Register";
import SignIn from "./pages/Auth/SignIn";
import NewDiscussion from "./pages/Discussion/NewDiscussion";
import AllDiscussions from "./pages/Discussion/AllDiscussions";
import SingleDiscussion from "./pages/Discussion/SingleDiscussion";
import NewComment from "./pages/Comment/NewComment";
import EditDiscussion from "./pages/Discussion/EditDiscussion";
import NewBook from "./pages/Book/NewBook";
import AllBooks from "./pages/Book/AllBooks";
import NewReview from "./pages/Review/NewReview";
import SingleBook from "./components/SingleBook";
import HomePage from "./pages/HomePage";
import { useAuth } from "./contexts/AuthContext";
import UserPage from "./pages/UserPage";
import SearchResults from "./components/Search/SearchResults";
import NotFound from "./pages/NotFound";
function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/search-results"
          element={
            <Layout>
              <SearchResults />
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
        {isAuthenticated ? (
          <Route
            path="/discussions/new"
            element={
              <Layout>
                <NewDiscussion />
              </Layout>
            }
          />
        ) : (
          <Route
            path="/sign-in"
            element={
              <Layout>
                <SignIn />
              </Layout>
            }
          />
        )}
        <Route
          path="/discussions"
          element={
            <Layout>
              <AllDiscussions />
            </Layout>
          }
        />
        <Route
          path="/discussions/:discussionId"
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
        {isAuthenticated ? (
          <Route
            path="/books/new"
            element={
              <Layout>
                <NewBook />
              </Layout>
            }
          />
        ) : (
          <Route
            path="/sign-in"
            element={
              <Layout>
                <SignIn />
              </Layout>
            }
          />
        )}
        <Route
          path="/books"
          element={
            <Layout>
              <AllBooks />
            </Layout>
          }
        />
        <Route
          path="/books/:bookId"
          element={
            <Layout>
              <SingleBook />
            </Layout>
          }
        />
        <Route
          path="/books/:bookId/reviews"
          element={
            <Layout>
              <NewReview />
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
        <Route
          path="/:userId"
          element={
            <Layout>
              <UserPage />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
