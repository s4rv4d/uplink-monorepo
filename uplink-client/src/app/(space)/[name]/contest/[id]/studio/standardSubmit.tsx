"use client";
import Editor from "@/ui/Editor/Editor";
import { OutputData } from "@editorjs/editorjs";
import Output from "editorjs-react-renderer";
import useSWRMutation from "swr/mutation";
import {
  HiCamera,
  HiCheckBadge,
  HiXCircle,
  HiOutlineTrash,
} from "react-icons/hi2";
import { useEffect, useReducer, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "@/providers/SessionProvider";
import { useContestState } from "@/providers/ContestStateProvider";
import { BiInfoCircle, BiPlusCircle, BiSolidCircle } from "react-icons/bi";
import Modal, { ModalActions } from "@/ui/Modal/Modal";
import WalletConnectButton from "@/ui/ConnectButton/ConnectButton";
import {
  UserSubmissionParams,
  useContestInteractionState,
} from "@/providers/ContestInteractionProvider";
import { Decimal } from "decimal.js";

import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
} from "media-chrome/dist/react";

import {
  useStandardSubmissionCreator,
  SubmissionBuilderProps,
} from "@/hooks/useStandardSubmissionCreator";
import { handleMutationError } from "@/lib/handleMutationError";
import { HiArrowNarrowLeft, HiBadgeCheck } from "react-icons/hi";
import Link from "next/link";
import { AddressOrEns } from "@/ui/AddressDisplay/AddressDisplay";

async function postSubmission(
  url,
  {
    arg,
  }: {
    arg: {
      contestId: string;
      submission: {
        title: string;
        body: OutputData | null;
        previewAsset: string | null;
        videoAsset: string | null;
      };
    };
  }
) {
  return fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      query: `
      mutation Mutation($contestId: ID!, $submission: SubmissionPayload!) {
        createSubmission(contestId: $contestId, submission: $submission) {
          errors
          success
          userSubmissionParams {
              maxSubPower
              remainingSubPower
              userSubmissions {
                  type
              }
          }
        }
      }`,
      variables: {
        contestId: arg.contestId,
        submission: arg.submission,
      },
    }),
  })
    .then((res) => res.json())
    .then(handleMutationError)
    .then((res) => res.data.createSubmission);
}

const ErrorLabel = ({ error }: { error?: string }) => {
  if (error)
    return (
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    );
  return null;
};

const SubmissionTitle = ({
  title,
  errors,
  setSubmissionTitle,
}: {
  title: string;
  errors: SubmissionBuilderProps["errors"];
  setSubmissionTitle: (val: string) => void;
}) => {
  const handleTitleChange = (e: any) => {
    setSubmissionTitle(e.target.value);
  };

  const handleTextareaResize = (e: any) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div>
      <div className="flex items-center">
        <label className="label">
          <span className="label-text text-t2">Title</span>
        </label>
        <p className="text-gray-500 text-sm text-right ml-auto">
          {`${title.length}/100`}
        </p>
      </div>

      <textarea
        rows={1}
        placeholder="What's happening?"
        className={`p-2 textarea textarea-lg resize-none w-full overflow-y-hidden ${
          errors?.title ? "textarea-error" : "textarea textarea-lg"
        }`}
        style={{ height: "auto" }}
        value={title}
        onChange={handleTitleChange}
        onInput={handleTextareaResize}
      />

      <ErrorLabel error={errors?.title} />
    </div>
  );
};

const MediaUpload = ({
  handleFileChange,
  submission,
  removeMedia,
  setVideoThumbnailBlobIndex,
}: {
  handleFileChange: any;
  submission: SubmissionBuilderProps;
  removeMedia: () => void;
  setVideoThumbnailBlobIndex: (val: number) => void;
}) => {
  const imageUploader = useRef<HTMLInputElement>(null);
  const thumbnailUploader = useRef<HTMLInputElement>(null);

  const Input = ({
    mode,
    children,
  }: {
    mode: "primary" | "thumbnail";
    children: React.ReactNode;
  }) => (
    <div>
      <input
        placeholder="asset"
        type="file"
        accept={mode === "primary" ? "image/*, video/mp4" : "image/*"}
        className="hidden"
        onChange={(event) =>
          handleFileChange({ event, isVideo: submission.isVideo, mode })
        }
        ref={mode === "primary" ? imageUploader : thumbnailUploader}
      />
      {children}
    </div>
  );

  if (submission.isVideo) {
    return (
      <div className="relative w-fit m-auto">
        <label className="label">
          <span className="label-text text-t2">Media</span>
        </label>
        <button
          className="absolute top-5 -right-3 btn btn-error btn-sm btn-circle z-10 shadow-lg"
          onClick={removeMedia}
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
        <MediaController className="rounded-xl">
          <video
            slot="media"
            src={submission.primaryAssetBlob}
            poster={
              submission.videoThumbnailBlobIndex !== null
                ? submission.videoThumbnailOptions[
                    submission.videoThumbnailBlobIndex
                  ]
                : ""
            }
            preload="auto"
            muted
            crossOrigin=""
            className="rounded-xl h-64 w-full object-contain"
          />
          <MediaControlBar>
            <MediaPlayButton></MediaPlayButton>
            <MediaTimeRange></MediaTimeRange>
            <MediaTimeDisplay showDuration></MediaTimeDisplay>
            <MediaMuteButton></MediaMuteButton>
          </MediaControlBar>
        </MediaController>
        {submission.videoThumbnailOptions?.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-center bg-base-100 border border-border p-2 w-fit m-auto rounded">
            <p className="self-center text-xs">Thumbnail</p>
            <div className="grid grid-cols-3 gap-4 justify-evenly auto-rows-fr">
              {submission.videoThumbnailOptions.map((thumbOp, thumbIdx) => {
                return (
                  <div
                    key={thumbIdx}
                    className="relative cursor-pointer"
                    onClick={() => setVideoThumbnailBlobIndex(thumbIdx)}
                  >
                    <Image
                      src={thumbOp}
                      alt="Tweet Media"
                      width={64}
                      height={64}
                      className={`hover:opacity-50 rounded aspect-video object-contain ${
                        submission.videoThumbnailBlobIndex === thumbIdx
                          ? "opacity-50"
                          : ""
                      }`}
                    />

                    {submission.videoThumbnailBlobIndex === thumbIdx && (
                      <BiSolidCircle className="absolute text-primary w-5 h-5 top-[-10px] right-[-10px]" />
                    )}
                  </div>
                );
              })}
              <Input mode="thumbnail">
                <div
                  className="w-full"
                  onClick={() => thumbnailUploader.current?.click()}
                >
                  <div className="w-full h-full bg-base-100 border border-border rounded opacity-50 hover:opacity-90 flex flex-col p-2 items-center justify-center cursor-pointer text-gray-500">
                    <BiPlusCircle className="w-4 h-4" />
                  </div>
                </div>
              </Input>
            </div>
          </div>
        )}
      </div>
    );
  } else if (submission.primaryAssetBlob) {
    return (
      <div className="flex flex-col items-center">
        <label className="label self-start">
          <span className="label-text text-t2">Media</span>
        </label>
        <div className="relative">
          <button
            className="absolute top-0 right-0 mt-[-10px] mr-[-10px] btn btn-error btn-sm btn-circle z-10 shadow-lg"
            onClick={removeMedia}
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
          <Image
            src={submission.primaryAssetBlob}
            alt="Tweet Media"
            width={200}
            height={200}
            className="rounded-lg object-contain"
          />
        </div>
      </div>
    );
  } else {
    return (
      <Input mode="primary">
        <label className="label">
          <span className="label-text text-t2">Media</span>
        </label>
        <div
          className="w-full h-56 cursor-pointer flex justify-center items-center hover:bg-base-100 transition-all rounded-xl border-2 border-border border-dashed"
          onClick={() => imageUploader.current?.click()}
        >
          <div className="flex justify-center items-center w-full h-full">
            <HiCamera className="w-8 h-8" />
          </div>
        </div>
      </Input>
    );
  }
};

const SubmissionBody = ({
  submissionBody,
  errors,
  setSubmissionBody,
}: {
  submissionBody: SubmissionBuilderProps["submissionBody"];
  errors: SubmissionBuilderProps["errors"];
  setSubmissionBody: (val: OutputData) => void;
}) => {
  const editorCallback = (data: OutputData) => {
    setSubmissionBody(data);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm p-1 mb-2 text-t2">Body</label>
      <ErrorLabel error={errors?.submissionBody} />
      <Editor
        data={submissionBody ?? undefined}
        editorCallback={editorCallback}
      />
    </div>
  );
};

const StudioSidebar = ({
  state,
  contestId,
  spaceName,
  validateSubmission,
  setErrors,
  isUploading,
}: {
  state: SubmissionBuilderProps;
  contestId: string;
  spaceName: string;
  validateSubmission: (state: SubmissionBuilderProps) => any;
  setErrors: (errors: any) => void;
  isUploading: boolean;
}) => {
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { userSubmitParams, areUserSubmitParamsLoading: isLoading } =
    useContestInteractionState();
  const { stateRemainingTime } = useContestState();

  const onSubmit = async () => {
    const { isError } = await validateSubmission(state);
    if (isError) return;
    setIsPreviewModalOpen(true);
  };

  // userSubmitParams are undefined if the user is not logged in, if the contest is not in the submit window, or if the fetch hasn't finished yet
  // at this stage, we can assume that the contest is in the submit window.
  if (isLoading) {
    // waiting for results. show loading state
    return <div className="w-full bg-base-100 h-24 shimmer rounded-xl" />;
  } else {
    return (
      <div className="flex flex-col items-start w-full ml-auto">
        <label className="label">
          <span className="label-text text-t2">Eligibility</span>
        </label>
        <div className="flex flex-col bg-base-100 rounded-lg gap-4 w-full p-2">
          {userSubmitParams && (
            <div className="flex flex-col gap-2 items-start justify-center w-full p-2">
              <div className="flex flex-row gap-2 w-full">
                <p>entries remaining</p>
                <p className="ml-auto">{userSubmitParams.remainingSubPower}</p>
              </div>
              {userSubmitParams.restrictionResults.length > 0 && (
                <div className="flex flex-row gap-2 w-full">
                  <div className="flex gap-2 items-center">
                    <p>satisfies restrictions?</p>
                    <BiInfoCircle
                      onClick={() => setIsRestrictionModalOpen(true)}
                      className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-300"
                    />
                  </div>
                  {userSubmitParams.restrictionResults.some(
                    (el) => el.result === true
                  ) ? (
                    <HiCheckBadge className="ml-auto w-6 h-6 text-success" />
                  ) : (
                    <HiXCircle className="ml-auto w-6 h-6" />
                  )}
                </div>
              )}
              <div className="flex flex-row gap-2 w-full">
                <p>status</p>
                {parseInt(userSubmitParams.remainingSubPower) > 0 &&
                new Decimal(userSubmitParams.maxSubPower).greaterThan(0) ? (
                  <p className="ml-auto">eligible</p>
                ) : (
                  <p className="ml-auto"> not eligible</p>
                )}
              </div>
            </div>
          )}
          <WalletConnectButton>
            <div className="flex flex-row items-center justify-between bg-base-200 rounded-lg gap-2 h-fit w-full">
              <button
                onClick={onSubmit}
                className="btn btn-accent flex flex-1 normal-case text-lg"
                disabled={
                  !userSubmitParams ||
                  parseInt(userSubmitParams.remainingSubPower) <= 0 ||
                  isUploading
                }
              >
                {isUploading ? (
                  <div className="flex gap-2 items-center">
                    <p className="text-sm">uploading media</p>
                    <div
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    />
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              <p className="mx-2 p-2 text-center">{stateRemainingTime}</p>
            </div>
          </WalletConnectButton>
        </div>
        <RestrictionModal
          isModalOpen={isRestrictionModalOpen}
          handleClose={() => setIsRestrictionModalOpen(false)}
          userSubmitParams={userSubmitParams}
        />
        <SubmissionPreviewModal
          submission={state}
          validateSubmission={validateSubmission}
          isModalOpen={isPreviewModalOpen}
          handleClose={() => setIsPreviewModalOpen(false)}
          contestId={contestId}
          spaceName={spaceName}
        />
      </div>
    );
  }
};

const SubmissionPreviewModal = ({
  submission,
  validateSubmission,
  isModalOpen,
  handleClose,
  contestId,
  spaceName,
}: {
  submission: SubmissionBuilderProps;
  validateSubmission: (state: SubmissionBuilderProps) => any;
  isModalOpen: boolean;
  handleClose: () => void;
  contestId: string;
  spaceName: string;
}) => {
  const { data: session, status } = useSession();
  const { trigger, data, error, isMutating, reset } = useSWRMutation(
    [`/api/userSubmitParams/${contestId}`, session?.user?.address],
    postSubmission,
    {
      onError: (err) => {
        console.log(err);
        onClose();
      },
    }
  );

  const submissionType = submission.isVideo
    ? "video"
    : submission.primaryAssetBlob
    ? "image"
    : "text";

  const handleSubmit = async () => {
    const { isError, payload } = await validateSubmission(submission);
    if (isError) {
      onClose();
    }
    try {
      await trigger({ contestId, submission: payload });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    return reset();
  }, []);

  const onClose = () => {
    handleClose();
    reset();
  };

  if (isModalOpen && !data)
    return (
      <Modal isModalOpen={true} onClose={onClose}>
        <div className="flex flex-col gap-4">
          <h2 className="text-t1">Preview</h2>
          <div className="alert">
            <BiInfoCircle className="w-5 h-5 text-info" />
            <span>
              This is what users will see before they expand your full
              submission.
            </span>
          </div>
          <div className="flex flex-col gap-2 w-9/12 m-auto">
            <div className="card card-compact cursor-pointer border border-border rounded-xl bg-base-100">
              {submissionType === "video" ? (
                <>
                  <RenderVideoPreview
                    video={submission.primaryAssetBlob}
                    thumbnail={
                      submission.videoThumbnailOptions[
                        submission.videoThumbnailBlobIndex
                      ]
                    }
                  />
                  <SubmissionCardBody
                    title={submission.title}
                    author={session?.user?.address}
                    subType={submissionType}
                  />
                </>
              ) : submissionType === "image" ? (
                <>
                  <RenderImagePreview image={submission.primaryAssetBlob} />
                  <SubmissionCardBody
                    title={submission.title}
                    author={session?.user?.address}
                    subType={submissionType}
                  />
                </>
              ) : (
                <RenderTextPreview
                  editorData={submission.submissionBody}
                  title={submission.title}
                  author={session?.user?.address}
                />
              )}
            </div>
          </div>
        </div>
        <ModalActions
          onCancel={onClose}
          onConfirm={handleSubmit}
          confirmLabel="Submit"
          cancelLabel="Edit"
          confirmDisabled={isMutating}
          isLoading={isMutating}
        />
      </Modal>
    );
  if (isModalOpen && data && data.success)
    return (
      <Modal isModalOpen={true} onClose={onClose}>
        <div className="flex flex-col items-center justify-center gap-6 p-2 w-10/12 m-auto rounded-xl">
          <HiBadgeCheck className="w-32 h-32 text-success" />
          <p className="text-2xl text-t1 text-center">{`Ok creatoooooooor - you're all set`}</p>
          <Link
            href={`/${spaceName}/contest/${contestId}`}
            className="btn btn-ghost text-t2 normal-case"
          >
            Go to contest
          </Link>
        </div>
      </Modal>
    );
};

const SubmissionCardBody = ({ title, author, subType }) => {
  return (
    <div className="card-body h-28 rounded-b-xl w-full">
      <h2 className={`card-title text-md ${title ? "" : "text-gray-500"}`}>
        {title || "My awesome new submission"}
      </h2>
      <p className="text-sm">
        <AddressOrEns address={author} />
      </p>
    </div>
  );
};

const RenderImagePreview = ({ image }: { image: string }) => {
  return (
    <div className="flex flex-col">
      <Image
        src={image}
        alt="submission preview"
        width={640}
        height={360}
        className="rounded-t-xl"
      />
    </div>
  );
};

const RenderTextPreview = ({
  editorData,
  title,
  author,
}: {
  editorData: OutputData;
  title: string;
  author: string;
}) => {
  return (
    <div className="card-body h-64 bg-white/90 rounded-xl text-black/80 gap-1 w-full overflow-auto">
      <h2 className="break-word font-bold text-2xl">
        {title || "My awesome new submission"}
      </h2>
      <h3 className="break-all italic">
        <AddressOrEns address={author} />
      </h3>
      <section className="break-all">
        <Output data={editorData} />
      </section>
    </div>
  );
};

const RenderVideoPreview = ({
  video,
  thumbnail,
}: {
  video: string;
  thumbnail: string;
}) => {
  return (
    <MediaController className="rounded-t-xl">
      <video
        slot="media"
        src={video}
        poster={thumbnail}
        preload="auto"
        muted
        crossOrigin=""
        className="rounded-t-xl h-64 w-full object-cover"
      />
      <MediaControlBar>
        <MediaPlayButton></MediaPlayButton>
        <MediaTimeRange></MediaTimeRange>
        <MediaTimeDisplay showDuration></MediaTimeDisplay>
        <MediaMuteButton></MediaMuteButton>
      </MediaControlBar>
    </MediaController>
  );
};

const RestrictionModal = ({
  isModalOpen,
  handleClose,
  userSubmitParams,
}: {
  isModalOpen: boolean;
  handleClose: () => void;
  userSubmitParams: UserSubmissionParams;
}) => {
  return (
    <Modal isModalOpen={isModalOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center bg-base rounded-xl p-2">
          <BiInfoCircle className="w-6 h-6 text-gray-500" />
          <p>
            Submitters must satisfy at least one restriction to create an entry.
          </p>
        </div>
        {userSubmitParams?.restrictionResults?.length ?? 0 > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>restrictions</th>
                  <th>Type</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userSubmitParams.restrictionResults.map((el, idx) => {
                  return (
                    <tr key={idx}>
                      <th>{idx + 1}</th>
                      <td>{el.restriction.tokenRestriction.token.type}</td>
                      <td>{el.restriction.tokenRestriction.threshold}</td>
                      {el.result === true ? (
                        <td>
                          <HiCheckBadge className="w-6 h-6 text-success" />
                        </td>
                      ) : (
                        <td>
                          <HiXCircle className="w-6 h-6 text-error" />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>no restrictions</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

const StudioSkeleton = () => {
  return (
    <div className="flex flex-col w-full xl:w-3/4 gap-4 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-[auto_33%] gap-4">
        <div className="flex flex-col gap-4">
          <div className="w-full bg-base-100 h-12 shimmer rounded-xl" />
          <div className="w-full bg-base-100 h-96 shimmer rounded-xl" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-full bg-base-100 h-64 shimmer rounded-xl" />
          <div className="w-full bg-base-100 h-24 shimmer rounded-xl" />
        </div>
      </div>

      {/* <div className="flex flex-col w-full lg:w-3/4 h-screen gap-4 m-8">
        <div className="flex flex-col lg:flex-row justify-between items-end">
          <div className="bg-base-100 w-full lg:w-[450px] h-12 shimmer rounded-xl" />
          <div className="w-28 h-28 lg:w-36 lg:h-36 cursor-pointer flex justify-center items-center bg-base-100 shimmer rounded-xl" />
        </div>
        <div className="flex flex-col w-full h-64 bg-base-100 shimmer" />
      </div>
      <div className="hidden lg:flex lg:flex-col items-center lg:w-2/6 gap-4">
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
        <div className="bg-base-100 w-full h-16 rounded-xl shimmer" />
      </div> */}
    </div>
  );
};

const StandardSubmit = ({
  params,
}: {
  params: { name: string; id: string };
}) => {
  const {
    submission,
    setSubmissionTitle,
    setSubmissionBody,
    setVideoThumbnailBlobIndex,
    handleFileChange,
    removeMediaAsset,
    validateSubmission,
    setErrors,
  } = useStandardSubmissionCreator();
  const { contestState } = useContestState();
  const { title, submissionBody, errors, isUploading } = submission;

  if (!contestState) {
    return <StudioSkeleton />;
  } else if (contestState !== "submitting") {
    return <p>not in submit window</p>;
  } else {
    // contest in submit window
    return (
      <div className="flex flex-col w-full xl:w-3/4 gap-4">
        <Link
          href={`/${params.name}/contest/${params.id}`}
          className="btn btn-ghost self-start btn-active"
        >
          <HiArrowNarrowLeft className="w-8 h-8" />
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-[auto_33%] gap-4">
          <div className="flex flex-col w-full gap-4 order-last md:order-1">
            <SubmissionTitle
              title={title}
              errors={errors}
              setSubmissionTitle={setSubmissionTitle}
            />
            <SubmissionBody
              submissionBody={submissionBody}
              errors={errors}
              setSubmissionBody={setSubmissionBody}
            />
          </div>
          <div className="flex flex-col-reverse md:flex-col w-full gap-4 order-1 md:order-2">
            <MediaUpload
              submission={submission}
              handleFileChange={handleFileChange}
              removeMedia={removeMediaAsset}
              setVideoThumbnailBlobIndex={setVideoThumbnailBlobIndex}
            />
            <StudioSidebar
              state={submission}
              contestId={params.id}
              spaceName={params.name}
              validateSubmission={validateSubmission}
              setErrors={setErrors}
              isUploading={isUploading}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default StandardSubmit;
