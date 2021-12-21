import { useQuery, gql } from "@apollo/client";

const REPO_QUERY = gql`
  query repoQuery($limit: Int, $after: String) {
    viewer {
      repositories(isFork: true, first: $limit, after: $after) {
        edges {
          node {
            id
            name
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

const Repos = () => {
  const LIMIT = 2;
  const { data, loading, error, fetchMore } = useQuery(REPO_QUERY, {
    variables: {
      limit: LIMIT,
      after: null,
    },
  });

  if (loading || !data) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleLoadMore = () => {
    const { endCursor, hasNextPage } = data.viewer.repositories.pageInfo;
    if (hasNextPage) {
      fetchMore({
        variables: {
          limit: LIMIT,
          after: endCursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          fetchMoreResult.viewer.repositories.edges = [
            ...prevResult.viewer.repositories.edges,
            ...fetchMoreResult.viewer.repositories.edges,
          ];
          return fetchMoreResult;
        },
      });
    }
  };

  return (
    <>
      <ul>
        {data.viewer.repositories.edges.map(({ node }) => (
          <li key={node.id}>{node.name}</li>
        ))}
      </ul>
      <button onClick={handleLoadMore}>Load More..</button>
    </>
  );
};

export default Repos;
