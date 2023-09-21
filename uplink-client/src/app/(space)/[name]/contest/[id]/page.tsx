import SubmissionDisplay from "@/ui/Contests/SubmissionDisplay";
import ContestSidebar from "@/ui/Contests/ContestSidebar";
import { getContestById } from "./fetchContest";
import MobileActions from "@/ui/Contests/MobileActions";
import ContestHeading from "@/ui/Contests/ContestHeading";
import SidebarVote from "@/ui/Contests/Vote";
import { Metadata, ResolvingMetadata } from "next";

// export async function generateMetadata({
//   params,
//   parent,
// }: {
//   params: { id: string; name: string };
//   parent: ResolvingMetadata;
// }): Promise<Metadata> {
//   const space = await getContestById(params.id);

//   return {
//     title: `${space.displayName}`,
//     description: `${space.displayName} on Uplink`,
//     openGraph: {
//       title: `${space.displayName}`,
//       description: `Create with ${space.displayName} on Uplink`,
//       images: [
//         {
//           url: `${space.logoUrl}`,
//           width: 600,
//           height: 600,
//           alt: `${space.displayName} logo`,
//         },
//       ],
//       locale: "en_US",
//       type: "website",
//     },
//   };
// }

export default async function Page({
  params,
}: {
  params: { id: string; name: string };
}) {
  const {
    metadata,
    deadlines,
    promptUrl,
    space,
    submitterRewards,
    voterRewards,
    votingPolicy,
    submitterRestrictions,
    tweetId,
  } = await getContestById(params.id);

  const promptData = await fetch(promptUrl).then((res) => res.json());

  return (
    <div className="flex gap-6 m-auto w-full lg:w-[91vw] h-full">
      <div className="flex w-full gap-6 ">
        <div className="hidden lg:block w-[15%] flex-grow h-fit border border-border rounded-lg">
          <ContestSidebar
            contestId={params.id}
            spaceName={params.name}
            spaceId={space.id}
            startTime={deadlines.startTime}
            prompt={promptData}
            submitterRewards={submitterRewards}
            voterRewards={voterRewards}
            votingPolicy={votingPolicy}
            submitterRestrictions={submitterRestrictions}
          />
        </div>
        <div className="w-[60%] flex-grow ">
          <div className="flex flex-col w-full gap-4">
            <ContestHeading
              space={space}
              metadata={metadata}
              deadlines={deadlines}
              prompt={promptData}
              tweetId={tweetId}
            />
            <MobileActions
              contestId={params.id}
              spaceName={params.name}
              submitterRewards={submitterRewards}
              voterRewards={voterRewards}
              votingPolicy={votingPolicy}
              submitterRestrictions={submitterRestrictions}
            />
            <SubmissionDisplay contestId={params.id} spaceName={params.name} />
          </div>
        </div>
      </div>
      <SidebarVote contestId={params.id} />
    </div>
  );
}
