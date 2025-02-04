import { BiTime } from "react-icons/bi";
import { ContestCategory, ContestState } from "@/types/contest";
import { BaseChainLogo } from "@/lib/chains/basechain"
import { OpChainLogo } from "@/lib/chains/opchain";
import { ZoraChainLogo } from "@/lib/chains/zorachain";
// return color for contest category
const contestCategoryColor = (contestCategory: ContestCategory) => {
  switch (contestCategory) {
    case "art":
      return {
        text: "text-orange-300",
        bg: "bg-orange-300",
      };
    case "music":
      return {
        text: "text-yellow-300",
        bg: "bg-yellow-300",
      };
    case "writing":
      return {
        text: "text-green-300",
        bg: "bg-green-300",
      };
    case "video":
      return {
        text: "text-blue-300",
        bg: "bg-blue-300",
      };
    case "photography":
      return {
        text: "text-indigo-300",
        bg: "bg-indigo-300",
      };
    case "design":
      return {
        text: "text-purple-300",
        bg: "bg-purple-300",
      };
    case "memes":
      return {
        text: "text-red-300",
        bg: "bg-red-300",
      };
    case "other":
      return {
        text: "text-gray-300",
        bg: "bg-gray-300",
      };
  }
};

export const CategoryLabel = ({ category }: { category: ContestCategory }) => {
  const { text, bg } = contestCategoryColor(category);
  return (
    <p className={`badge border-none badge-md ${bg} ${text} bg-opacity-30`}>
      {category}
    </p>
  );
};

// return color for contest state
const contestStatusColor = (contestState: ContestState) => {
  switch (contestState) {
    case "pending":
      return {
        text: "text-purple-500",
        bg: "bg-purple-500",
      };
    case "submitting":
      return {
        text: "text-green-300",
        bg: "bg-green-300",
      };
    case "voting":
      return {
        text: "text-yellow-500",
        bg: "bg-yellow-500",
      };
    case "closed":
      return {
        text: "text-gray-600",
        bg: "bg-gray-600",
      };
  }
};

export const StatusLabel = ({ status }: { status: ContestState }) => {
  const { text, bg } = contestStatusColor(status);
  return (
    <p className={`badge border-none badge-md ${bg} ${text} bg-opacity-30`}>
      {status}
    </p>
  );
};

export const ChainLabel = ({ chainId, px }: { chainId: number, px: number }) => {
  if (chainId === 8453) {
    return (
      <div
        className="tooltip tooltip-top cursor-pointer"
        data-tip="Base"
      >
        <BaseChainLogo px={px} />

      </div>
    )
  }

  if (chainId === 10) {
    return (
      <div
        className="tooltip tooltip-top cursor-pointer"
        data-tip="Optimism"
      >
        <OpChainLogo px={px} />

      </div>
    )
  }

  if (chainId === 7777777) {
    return (
      <div
        className="tooltip tooltip-top cursor-pointer"
        data-tip="Zora"
      >
        <ZoraChainLogo px={px} />

      </div>
    )
  }


  if (chainId === 84531) {
    return (
      <div
        className="tooltip tooltip-top cursor-pointer"
        data-tip="Base Testnet"
      >
        <BaseChainLogo px={px} />

      </div>
    )
  }


  if (chainId === 420) {
    return (
      <div
        className="tooltip tooltip-top cursor-pointer"
        data-tip="Optimism Goerli"
      >
        <OpChainLogo px={px} />

      </div>
    )
  }

  if (chainId === 999) {
    return (
      <div
        className="tooltip tooltip-top cursor-pointer"
        data-tip="Zora Goerli"
      >
        <ZoraChainLogo px={px} />

      </div>
    )
  }




  return null;
}


export const RemainingTimeLabel = ({
  remainingTime,
}: {
  remainingTime: string | null;
}) => {
  if (remainingTime)
    return (
      <div className="flex gap-1 text-sm text-gray-500 items-center">
        <BiTime className="h-4 w-4" />
        <p>
          <i>{remainingTime}</i>
        </p>
      </div>
    );
  else return null;
};
