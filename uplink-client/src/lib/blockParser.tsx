import { OutputData } from "@editorjs/editorjs";
import Image from "next/image";
import React from "react";

function createTextLinks_(text: string) {
  return (text || "").replace(
    /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
    function (match, space, url) {
      var hyperlink = url;
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink;
      }
      return (
        space + '<a target="_blank" href="' + hyperlink + '">' + url + "</a>"
      );
    }
  );
}

export const ParseBlocks = ({
  data,
  omitImages = false,
}: {
  data: OutputData;
  omitImages?: boolean;
}) => {
  if (!data || data.blocks.length === 0) return null;
  return data.blocks.map((block, index) => {
    if (block.type === "paragraph") {
      return <p key={index}>{block.data.text}</p>;
    } else if (block.type === "header") {
      return React.createElement(
        `h${block.data.level}`,
        { key: index },
        block.data.text
      );
    } else if (block.type === "image" && !omitImages) {
      return (
        <div key={index} className="relative media-grid-item w-full h-full">
          <figure className="absolute inset-0 overflow-hidden rounded-xl">
            <Image
              key={index}
              src={block.data.file.url}
              alt="content media"
              fill
              className="object-contain"
            />
          </figure>
        </div>
      );
    }
    return null;
  });
};
