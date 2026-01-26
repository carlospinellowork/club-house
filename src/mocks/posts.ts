
export const toggleLikeAction = jest.fn();
export const toggleFollowAction = jest.fn();

jest.mock("@/server/actions", () => ({
  toggleLikeAction: jest.fn(),
  toggleFollowAction: jest.fn(),
}));

jest.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({
      post: {
        getAll: { invalidate: jest.fn() },
      },
      member: {
        getAllPostsByMember: { invalidate: jest.fn() },
      },
    }),
  },
}));


jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

export const postMock = {
  id: "post-1",
  content: "Meu post de teste",
  likes: 3,
  comments: 1,
  isLiked: false,
  user: {
    id: "user-1",
    name: "Carlos",
    email: "carlos@test.com",
    image: null,
    bio: "Dev",
  },
};
