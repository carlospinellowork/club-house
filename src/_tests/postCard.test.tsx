import { fireEvent, render, screen } from "@testing-library/react";

import "@/mocks/posts";
import { postMock } from "@/mocks/posts";

import { PostCard } from "../app/(dashboard)/feed/[id]/_components/post-card";

import { toggleLikeAction } from "@/server/actions";

describe("PostCard - Like", () => {
  it("chama toggleLikeAction ao clicar no botão de like", async () => {
    render(<PostCard postCard={postMock as any} />);

    const likeButton = screen.getByRole("button", {
      name: /3/i,
    });

    fireEvent.click(likeButton);

    expect(toggleLikeAction).toHaveBeenCalledWith({
      postId: "post-1",
    });
  });

  it("mostra o ícone de coração preenchido quando o post foi curtido isLiked = true", () => {
    render(<PostCard postCard={{ ...postMock, isLiked: true } as any} />);

    const heartIcon = screen.getByTestId("heart-icon");

    expect(heartIcon).toHaveClass("fill-current");
  });
})