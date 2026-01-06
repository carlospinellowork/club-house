import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

export const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
  }),

  Placeholder.configure({
    placeholder: "Escreva algo incrível...",
  }),

  Image.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg border border-muted",
    },
  }),
];
