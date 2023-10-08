"use client"
import Image from "next/image";
import dynamic from "next/dynamic";
import React from "react";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

type Props = {
  content: any;
};

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput = ({ content }: Props) => {
  return (
    <Output
      className="text-sm"
      renderers={renderers}
      style={style}
      data={content}
    />
  );
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem] my-8">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  data;

  return (
    <pre className="bg-gray-800 rounded-md p-4 w-fit">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}

export default EditorOutput;
