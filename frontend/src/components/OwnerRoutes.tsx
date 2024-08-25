import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "react-query";
import { fetchDiscussionOwner } from "../api-client"; // Adjust the import path

type OwnerRouteProps = {
  children: React.ReactNode;
};

const OwnerRoute: React.FC<OwnerRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { discussionId } = useParams<{ discussionId: string }>();

  const { data: owner, isLoading } = useQuery(
    ["discussionOwner", discussionId],
    () => fetchDiscussionOwner(discussionId as string),
    { enabled: !!discussionId }
  );

  if (isLoading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (owner?.userId !== user?.userId) {
    return <Navigate to="/forbidden" />;
  }

  return <>{children}</>;
};

export default OwnerRoute;
