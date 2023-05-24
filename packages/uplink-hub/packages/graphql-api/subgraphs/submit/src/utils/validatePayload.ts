import { EditorOutputData } from "lib";

const validateTitle = (title: string) => {
    const errorArr: string[] = [];

    if (!title) {
        errorArr.push("Submission title is required");
    }

    if (title.length > 50) {
        errorArr.push("Title must be less than 50 characters");
    }

    const cleanedTitle = title.trim();

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return {
        error,
        result: cleanedTitle
    }
}

const validateBody = (body: EditorOutputData | null) => {
    if (!body) return
    else if (body.blocks.length === 0) {
        return { error: "Submission body blocks cannot be empty" }
    }
    return { result: body }
}

const createTemplate = (videoAsset: string | null, previewAsset?: string, body?: EditorOutputData | null) => {
    if (videoAsset) return "video";
    else if (previewAsset) return "image";
    else if (body) return "text";
    else return null;
}


const composeSubmission = async (previewAsset: string | null, videoAsset: string | null, body: EditorOutputData | null) => {
    const errorArr: string[] = [];

    const template = createTemplate(videoAsset, previewAsset, body);

    if (!template) return {
        error: "Submission content is required",
        result: {}
    }

    if (template === "video" && !previewAsset) {
        errorArr.push("Preview asset is required");
    }

    const bodyResult = validateBody(body);
    if (bodyResult?.error) errorArr.push(bodyResult.error)

    const error = errorArr.length > 0 ? errorArr.join(", ") : undefined;

    return {
        error,
        result: {
            template,
            ...(videoAsset ? { videoAsset: videoAsset } : {}),
            ...(previewAsset ? { previewAsset: previewAsset } : {}),
            ...(bodyResult?.result ? { body: bodyResult.result } : {}),
        }
    }
}



const validateSubmissionPayload = async (
    payload: {
        title: string,
        previewAsset: string | null,
        videoAsset: string | null,
        body: EditorOutputData | null
    }) => {
    const { title, previewAsset, videoAsset, body } = payload;

    const titleResult = validateTitle(title);
    const contentResult = await composeSubmission(previewAsset, videoAsset, body);

    const errors = {
        ...(titleResult.error ? { title: titleResult.error } : {}),
        ...(contentResult.error ? { content: contentResult.error } : {}),
    }

    const isSuccess = Object.keys(errors).length === 0;

    return {
        success: isSuccess,
        errors: errors,
        cleanPayload: {
            title: titleResult.result,
            ...contentResult.result
        }
    }
}

export {
    validateTitle,
    validateBody,
    composeSubmission,
    validateSubmissionPayload
}
