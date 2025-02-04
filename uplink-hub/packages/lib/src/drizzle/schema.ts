import { mysqlTable, index, serial, tinyint, json, varchar, int, text, uniqueIndex } from 'drizzle-orm/mysql-core';
import { InferModel, relations } from 'drizzle-orm';

export const spaces = mysqlTable('spaces', {
    id: serial('id').primaryKey(),
    created: varchar('created', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    displayName: varchar('displayName', { length: 255 }).notNull(),
    members: int('members').notNull(),
    logoUrl: varchar('logoUrl', { length: 255 }).notNull(),
    twitter: varchar('twitter', { length: 255 }),
    website: varchar('website', { length: 255 }),
}, (spaces) => ({
    spaceNameIndex: uniqueIndex("name_idx").on(
        spaces.name
    ),
}))

export const admins = mysqlTable('admins', {
    id: serial('id').primaryKey(),
    spaceId: int('spaceId').notNull(),
    address: varchar('address', { length: 255 }).notNull(),
}, (admins) => ({
    spaceIdIndex: index("admins_space_id_idx").on(admins.spaceId),
    userAddressIndex: index("admins_address_idx").on(admins.address),
}))


export const contests = mysqlTable('contests', {
    id: serial('id').primaryKey(),
    spaceId: int('spaceId').notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    category: varchar('category', { length: 255 }).notNull(),
    startTime: varchar('startTime', { length: 255 }).notNull(),
    voteTime: varchar('voteTime', { length: 255 }).notNull(),
    endTime: varchar('endTime', { length: 255 }).notNull(),
    snapshot: varchar('snapshot', { length: 255 }).notNull(),
    promptUrl: varchar('promptUrl', { length: 255 }).notNull(),
    anonSubs: tinyint('anonSubs').notNull(),
    visibleVotes: tinyint('visibleVotes').notNull(),
    selfVote: tinyint('selfVote').notNull(),
    subLimit: int('subLimit').notNull(),
    tweetId: varchar('tweetId', { length: 255 }),
    chainId: int('chainId').notNull().default(1),
}, (contests) => ({
    spaceIdIndex: index("contest_space_id_idx").on(contests.spaceId),
}))


export const rewards = mysqlTable('rewards', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    rank: int('rank').notNull(),
    recipient: varchar('recipient', { length: 255 }).notNull(),
}, (rewards) => ({
    contestIdIndex: index("rewards_contest_id_idx").on(rewards.contestId),
}));


export const submitterRestrictions = mysqlTable('submitterRestrictions', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    restrictionType: varchar('restrictionType', { length: 255 }).notNull(),

}, (submitterRestriction) => ({
    submitterRestrictionContestIdIndex: index("submitterRestriction_contest_id_idx").on(submitterRestriction.contestId),
}));

export const tokens = mysqlTable('tokens', {
    id: serial('id').primaryKey(),
    tokenHash: varchar('tokenHash', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    symbol: varchar('symbol', { length: 255 }).notNull(),
    decimals: int('decimals').notNull(),
    chainId: int('chainId').notNull().default(1),
    address: varchar('address', { length: 255 }),
    tokenId: int('tokenId'),
}, (tokens) => ({
    tokenHashIndex: uniqueIndex("tokenhash_idx").on(
        tokens.tokenHash
    )
}))

export const spaceTokens = mysqlTable('spaceTokens', {
    id: serial('id').primaryKey(),
    spaceId: int('spaceId').notNull(),
    tokenLink: int('tokenLink').notNull(),
}, (spaceTokens) => ({
    spaceTokensIdIndex: uniqueIndex("spaceTokens_id_idx").on(spaceTokens.spaceId, spaceTokens.tokenLink),
}));


export const tokenRestrictions = mysqlTable('tokenRestrictions', {
    id: serial('id').primaryKey(),
    restrictionId: int('restrictionId').notNull(),
    tokenLink: int('tokenLink').notNull(),
    threshold: varchar('threshold', { length: 255 }).notNull(),
}, (tokenRestrictions) => ({
    tokenRestrictionsRestrictionIdIndex: uniqueIndex("tokenRestrictions_restriction_id_idx").on(tokenRestrictions.restrictionId),
    tokenRestrictionsTokenLinkIndex: index("tokenRestrictions_token_link_idx").on(tokenRestrictions.tokenLink),
}));

export const tokenRewards = mysqlTable('tokenRewards', {
    id: serial('id').primaryKey(),
    rewardId: int('rewardId').notNull(),
    tokenLink: int('tokenLink').notNull(),
    amount: varchar('amount', { length: 255 }),
    tokenId: int('tokenId'),
}, (tokenRewards) => ({
    tokenRewardsRewardIdIndex: uniqueIndex("tokenRewards_reward_id_idx").on(tokenRewards.rewardId),
    tokenRewardsTokenLinkIndex: index("tokenRewards_token_link_idx").on(tokenRewards.tokenLink),
}));

export const votingPolicy = mysqlTable('votingPolicy', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    strategyType: varchar('strategyType', { length: 255 }).notNull(),
}, (votingPolicy) => ({
    votingPolicyContestIdIndex: index("votingPolicy_contest_id_idx").on(votingPolicy.contestId),
}));

export const weightedVotingStrategy = mysqlTable('weightedVotingStrategy', {
    id: serial('id').primaryKey(),
    votingPolicyId: int('votingPolicyId').notNull(),
    tokenLink: int('tokenLink').notNull(),
}, (weightedVotingStrategy) => ({
    weightedVotingStrategyVotingPolicyIdIndex: uniqueIndex("weightedVotingStrategy_voting_policy_id_idx").on(weightedVotingStrategy.votingPolicyId),
    weightedVotingStrategyTokenLinkIndex: index("weightedVotingStrategy_token_link_idx").on(weightedVotingStrategy.tokenLink),
}));

export const arcadeVotingStrategy = mysqlTable('arcadeVotingStrategy', {
    id: serial('id').primaryKey(),
    votingPolicyId: int('votingPolicyId').notNull(),
    tokenLink: int('tokenLink').notNull(),
    votingPower: varchar('votingPower', { length: 255 }).notNull(),
}, (arcadeVotingStrategy) => ({
    arcadeVotingStrategyVotingPolicyIdIndex: uniqueIndex("arcadeVotingStrategy_voting_policy_id_idx").on(arcadeVotingStrategy.votingPolicyId),
    arcadeVotingStrategyTokenLinkIndex: index("arcadeVotingStrategy_token_link_idx").on(arcadeVotingStrategy.tokenLink),
}));

export const submissions = mysqlTable('submissions', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    userId: int('userId').notNull().default(1),
    created: varchar('created', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    url: varchar('url', { length: 255 }).notNull(),
    version: varchar('version', { length: 255 }).notNull(),
}, (submissions) => ({
    submissionsContestIdIndex: index("submissions_contest_id_idx").on(submissions.contestId),
    submissionsUserIdIndex: index("submissions_user_id_idx").on(submissions.userId),
}));

export const votes = mysqlTable('votes', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    submissionId: int('submissionId').notNull(),
    userId: int('userId').notNull().default(1),
    created: varchar('created', { length: 255 }).notNull(),
    amount: varchar('amount', { length: 255 }).notNull()
}, (votes) => ({
    votesContestIdIndex: index("votes_contest_id_idx").on(votes.contestId),
    votesSubmissionIdIndex: index("votes_submission_id_idx").on(votes.submissionId),
    voterUniqueIndex: uniqueIndex("votes_unique_idx").on(votes.contestId, votes.submissionId, votes.userId),
    votesUserIdIndex: index("votes_user_id_idx").on(votes.userId),
}));


// upload media and send tweets

export const tweetQueue = mysqlTable('tweetQueue', {
    id: serial('id').primaryKey(),
    contestId: int('contestId').notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    userId: int('userId').notNull().default(1),
    jobContext: varchar('jobContext', { length: 255 }).notNull(),   // 'submission' or 'contest'
    payload: json('payload').notNull().default('[]'),
    accessToken: varchar('accessToken', { length: 255 }).notNull(),
    expiresAt: varchar('expiresAt', { length: 255 }).notNull(),
    retries: int('retries').notNull(),
    status: tinyint('status').notNull(),                        // 0 = pending, 1 = failed, 2 = success
    error: json('error'),
});

export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    address: varchar('address', { length: 255 }).notNull(),
    userName: varchar('userName', { length: 255 }),
    displayName: varchar('displayName', { length: 255 }),
    profileAvatar: varchar('profileAvatar', { length: 255 }),
    twitterId: varchar('twitterId', { length: 255 }),
    twitterHandle: varchar('twitterHandle', { length: 255 }),
    twitterAvatarUrl: varchar('twitterAvatar', { length: 255 }),
    visibleTwitter: tinyint('visibleTwitter').default(0),
}, (user) => ({
    userAddressIndex: uniqueIndex("user_address_idx").on(user.address)
}));

export const userDrops = mysqlTable('userDrops', {
    id: serial('id').primaryKey(),
    userId: int('userId').notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    contestId: int('contestId').notNull(),
    submissionId: int('submissionId').notNull(),
    chainId: int('chainId').notNull(),
    contractAddress: varchar('contractAddress', { length: 255 }).notNull(),
    dropConfig: json('dropConfig').notNull(),
}, (userDrop) => ({
    userDropUserIdIndex: index("userDrop_user_id_idx").on(userDrop.userId),
    userDropUniqueIndex: uniqueIndex("userDrop_unique_idx").on(userDrop.userId, userDrop.contestId, userDrop.submissionId),
}));

export const submissionDrops = mysqlTable('submissionDrops', {
    id: serial('id').primaryKey(),
    userId: int('userId').notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    contestId: int('contestId').notNull(),
    submissionId: int('submissionId').notNull(),
    editionId: int('editionId').notNull(),
}, (submissionDrop) => ({
    submissionDropUserIdIndex: index("submissionDrop_user_id_idx").on(submissionDrop.userId),
    submissionDropContestIdIndex: index("submissionDrop_contest_id_idx").on(submissionDrop.contestId),
    submissionDropUniqueIndex: uniqueIndex("submissionDrop_unique_idx").on(submissionDrop.userId, submissionDrop.contestId, submissionDrop.submissionId),
}));

export const zoraEditions = mysqlTable('zoraEditions', {
    id: serial('id').primaryKey(),
    chainId: int('chainId').notNull(),
    contractAddress: varchar('contractAddress', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    symbol: varchar('symbol', { length: 255 }).notNull(),
    editionSize: varchar('editionSize', { length: 255 }).notNull(),
    royaltyBPS: int('royaltyBPS').notNull(),
    fundsRecipient: varchar('fundsRecipient', { length: 255 }).notNull(),
    defaultAdmin: varchar('defaultAdmin', { length: 255 }).notNull(),
    description: text('description').notNull(),
    animationURI: varchar('animationURI', { length: 255 }).notNull(),
    imageURI: varchar('imageURI', { length: 255 }).notNull(),
    referrer: varchar('referrer', { length: 255 }).notNull(),
    publicSalePrice: varchar('publicSalePrice', { length: 255 }).notNull(),
    maxSalePurchasePerAddress: int('maxSalePurchasePerAddress').notNull(),
    publicSaleStart: varchar('publicSaleStart', { length: 255 }).notNull(),
    publicSaleEnd: varchar('publicSaleEnd', { length: 255 }).notNull(),
    presaleStart: varchar('presaleStart', { length: 255 }).notNull(),
    presaleEnd: varchar('presaleEnd', { length: 255 }).notNull(),
    presaleMerkleRoot: varchar('presaleMerkleRoot', { length: 255 }).notNull(),
}, (zoraEdition) => ({

}));

export const editionMints = mysqlTable('editionMints', {
    id: serial('id').primaryKey(),
    userId: int('userId').notNull(),
    editionId: int('editionId').notNull(),
    amount: int('amount').notNull(),
}, (editionMint) => ({
    editionMintEditionIdIndex: index("editionMint_edition_id_idx").on(editionMint.editionId),
    editionMintUserIdIndex: index("editionMint_user_id_idx").on(editionMint.userId),
}));


export const mintBoards = mysqlTable('mintBoards', {
    id: serial('id').primaryKey(),
    spaceId: int('spaceId').notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    enabled: tinyint('enabled').notNull(),
    threshold: int('threshold').default(0),
    chainId: int('chainId').notNull(),
    boardTitle: varchar('boardTitle', { length: 255 }).notNull(),
    boardDescription: text('boardDescription').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    symbol: varchar('symbol', { length: 255 }).notNull(),
    editionSize: varchar('editionSize', { length: 255 }).notNull(),
    publicSalePrice: varchar('publicSalePrice', { length: 255 }).notNull(),
    publicSaleStart: varchar('publicSaleStart', { length: 255 }).notNull(),
    publicSaleEnd: varchar('publicSaleEnd', { length: 255 }).notNull(),
    description: text('description').notNull(),
    referrer: varchar('referrer', { length: 255 }).notNull(),
})

export const mintBoardPosts = mysqlTable('mintBoardPosts', {
    id: serial('id').primaryKey(),
    spaceId: int('spaceId').notNull(),
    boardId: int('boardId').notNull(),
    userId: int('userId').notNull(),
    created: varchar('created', { length: 255 }).notNull(),
    editionId: int('editionId').notNull(),
}, (mintBoardPost) => ({
    mintBoardPostUserIdIndex: index("mintBoardPost_user_id_idx").on(mintBoardPost.userId),
    mintBoardPostSpaceIdIndex: index("mintBoardPost_space_id_idx").on(mintBoardPost.spaceId),
    mintBoardPostBoardIdIndex: index("mintBoardPost_board_id_idx").on(mintBoardPost.boardId),
    mintBoardPostEditionIdIndex: index("mintBoardPost_edition_id_idx").on(mintBoardPost.editionId),
}))

export const spacesRelations = relations(spaces, ({ one, many }) => ({
    admins: many(admins),
    spaceTokens: many(spaceTokens),
    mintBoard: one(mintBoards, {
        fields: [spaces.id],
        references: [mintBoards.spaceId],
    }),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
    space: one(spaces, {
        fields: [admins.spaceId],
        references: [spaces.id]
    })
}));

export const mintBoardRelations = relations(mintBoards, ({ one, many }) => ({
    posts: many(mintBoardPosts),
}));

export const mintBoardPostsRelations = relations(mintBoardPosts, ({ one, many }) => ({
    author: one(users, {
        fields: [mintBoardPosts.userId],
        references: [users.id],
    }),
    mintBoard: one(mintBoards, {
        fields: [mintBoardPosts.boardId],
        references: [mintBoards.id],
    }),
    edition: one(zoraEditions, {
        fields: [mintBoardPosts.editionId],
        references: [zoraEditions.id],
    })
}));

export const zoraEditionRelations = relations(zoraEditions, ({ one, many }) => ({
    mints: many(editionMints),
}));

export const contestsRelations = relations(contests, ({ many }) => ({
    rewards: many(rewards),
    submitterRestrictions: many(submitterRestrictions),
    votingPolicy: many(votingPolicy),
    submissions: many(submissions),
    votes: many(votes),
    scheduledTweets: many(tweetQueue),
}));

export const rewardsRelations = relations(rewards, ({ one, many }) => ({
    contest: one(contests, {
        fields: [rewards.contestId],
        references: [contests.id]
    }),
    tokenReward: one(tokenRewards, {
        fields: [rewards.id],
        references: [tokenRewards.rewardId]
    })
}));

export const submitterRestrictionsRelations = relations(submitterRestrictions, ({ one }) => ({
    contest: one(contests, {
        fields: [submitterRestrictions.contestId],
        references: [contests.id]
    }),
    tokenRestriction: one(tokenRestrictions, {
        fields: [submitterRestrictions.id],
        references: [tokenRestrictions.restrictionId]
    })
}));

export const spaceTokensRelations = relations(spaceTokens, ({ one }) => ({
    space: one(spaces, {
        fields: [spaceTokens.spaceId],
        references: [spaces.id],
    }),
    token: one(tokens, {
        fields: [spaceTokens.tokenLink],
        references: [tokens.id],
    }),
}));

export const tokensRelations = relations(tokens, ({ many }) => ({
    spaceTokens: many(spaceTokens),
}));

export const tokenRewardsRelations = relations(tokenRewards, ({ one }) => ({
    reward: one(rewards, {
        fields: [tokenRewards.rewardId],
        references: [rewards.id],
    }),
    token: one(tokens, {
        fields: [tokenRewards.tokenLink],
        references: [tokens.id],
    }),
}));

export const tokenRestrictionsRelations = relations(tokenRestrictions, ({ one }) => ({
    submitterRestriction: one(submitterRestrictions, {
        fields: [tokenRestrictions.restrictionId],
        references: [submitterRestrictions.id],
    }),
    token: one(tokens, {
        fields: [tokenRestrictions.tokenLink],
        references: [tokens.id],
    }),
}));

export const votingPolicyRelations = relations(votingPolicy, ({ one }) => ({
    contest: one(contests, {
        fields: [votingPolicy.contestId],
        references: [contests.id],
    }),
    weightedVotingStrategy: one(weightedVotingStrategy, {
        fields: [votingPolicy.id],
        references: [weightedVotingStrategy.votingPolicyId],
    }),
    arcadeVotingStrategy: one(arcadeVotingStrategy, {
        fields: [votingPolicy.id],
        references: [arcadeVotingStrategy.votingPolicyId],
    }),
}));

export const weightedVotingStrategyRelations = relations(weightedVotingStrategy, ({ one }) => ({
    votingPolicy: one(votingPolicy, {
        fields: [weightedVotingStrategy.votingPolicyId],
        references: [votingPolicy.id],
    }),
    token: one(tokens, {
        fields: [weightedVotingStrategy.tokenLink],
        references: [tokens.id],
    }),
}));

export const arcadeVotingStrategyRelations = relations(arcadeVotingStrategy, ({ one }) => ({
    votingPolicy: one(votingPolicy, {
        fields: [arcadeVotingStrategy.votingPolicyId],
        references: [votingPolicy.id],
    }),
    token: one(tokens, {
        fields: [arcadeVotingStrategy.tokenLink],
        references: [tokens.id],
    }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
    author: one(users, {
        fields: [submissions.userId],
        references: [users.id],
    }),
    contest: one(contests, {
        fields: [submissions.contestId],
        references: [contests.id],
    }),
    nftDrop: one(submissionDrops, {
        fields: [submissions.id],
        references: [submissionDrops.submissionId],
    }),
    votes: many(votes),
}));


export const submissionDropRelations = relations(submissionDrops, ({ one }) => ({
    edition: one(zoraEditions, {
        fields: [submissionDrops.editionId],
        references: [zoraEditions.id],
    }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
    voter: one(users, {
        fields: [votes.userId],
        references: [users.id],
    }),
    contest: one(contests, {
        fields: [votes.contestId],
        references: [contests.id],
    }),
    submission: one(submissions, {
        fields: [votes.submissionId],
        references: [submissions.id],
    }),
}));

export const tweetQueueRelations = relations(tweetQueue, ({ one }) => ({
    contest: one(contests, {
        fields: [tweetQueue.contestId],
        references: [contests.id],
    }),
    user: one(users, {
        fields: [tweetQueue.userId],
        references: [users.id],
    })
}));

export const userRelations = relations(users, ({ one, many }) => ({
    submissions: many(submissions)
}));




export type dbSpaceType = InferModel<typeof spaces> & {
    admins: dbAdminType[],
    spaceTokens: dbSpaceToTokenType[],
    mintBoard: dbMintBoardType,
}
export type dbNewSpaceType = InferModel<typeof spaces, 'insert'>

export type dbAdminType = InferModel<typeof admins> & {
    space: dbSpaceType,
}
export type dbNewAdminType = InferModel<typeof admins, 'insert'>

export type dbContestType = InferModel<typeof contests> & {
    rewards: dbRewardType[],
    submitterRestrictions: dbSubmitterRestrictionType[],
    votingPolicy: dbVotingPolicyType[],
    submissions: dbSubmissionType[],
    votes: dbVoteType[],
    scheduledTweets: dbTweetQueueType[],
}

export type dbRewardType = InferModel<typeof rewards> & {
    contest: dbContestType,
    tokenReward: dbTokenRewardType,
}

export type dbSubmitterRestrictionType = InferModel<typeof submitterRestrictions> & {
    contest: dbContestType,
    tokenRestriction: dbTokenRestrictionType,
}

export type dbTokenType = InferModel<typeof tokens> & {
    spaceTokens: dbSpaceToTokenType[],
}

export type dbSpaceToTokenType = InferModel<typeof spaceTokens> & {
    space: dbSpaceType,
    token: dbTokenType,
}

export type dbTokenRestrictionType = InferModel<typeof tokenRestrictions> & {
    submitterRestriction: dbSubmitterRestrictionType,
    token: dbTokenType,
}

export type dbTokenRewardType = InferModel<typeof tokenRewards> & {
    reward: dbRewardType,
    token: dbTokenType,
}

export type dbVotingPolicyType = InferModel<typeof votingPolicy> & {
    contest: dbContestType,
    weightedVotingStrategy: dbWeightedVotingStrategyType,
    arcadeVotingStrategy: dbArcadeVotingStrategyType,
}

export type dbWeightedVotingStrategyType = InferModel<typeof weightedVotingStrategy> & {
    votingPolicy: dbVotingPolicyType,
    token: dbTokenType,
}

export type dbArcadeVotingStrategyType = InferModel<typeof arcadeVotingStrategy> & {
    votingPolicy: dbVotingPolicyType,
    token: dbTokenType,
}

export type dbUserDropType = InferModel<typeof userDrops>

export type dbSubmissionType = InferModel<typeof submissions> & {
    author: dbUserType,
    contest: dbContestType,
    nftDrop: dbSubmissionDropType,
    votes: dbVoteType[],
}

export type dbVoteType = InferModel<typeof votes> & {
    contest: dbContestType,
    submission: dbSubmissionType,
    voter: dbUserType,
}

export type dbTweetQueueType = InferModel<typeof tweetQueue> & {
    contest: dbContestType,
    user: dbUserType,
}

export type dbUserType = InferModel<typeof users> & {
    submissions: dbSubmissionType
}

export type dbMintBoardType = InferModel<typeof mintBoards> & {
    submissions: dbMintBoardPostType[]
}

export type dbZoraEditionType = InferModel<typeof zoraEditions> & {
    mints: dbEditionMintType[],
}

export type dbEditionMintType = InferModel<typeof editionMints>

export type dbMintBoardPostType = InferModel<typeof mintBoardPosts> & {
    author: dbUserType,
    mintBoard: dbMintBoardType,
    edition: dbZoraEditionType,
}

export type dbSubmissionDropType = InferModel<typeof submissionDrops> & {
    edition: dbZoraEditionType,
}

export type dbNewContestType = InferModel<typeof contests, 'insert'>
export type dbNewRewardType = InferModel<typeof rewards, 'insert'>
export type dbNewSubmitterRestrictionType = InferModel<typeof submitterRestrictions, 'insert'>
export type dbNewTokenType = InferModel<typeof tokens, 'insert'>
export type dbNewSpaceToTokenType = InferModel<typeof spaceTokens, 'insert'>
export type dbNewTokenRestrictionType = InferModel<typeof tokenRestrictions, 'insert'>
export type dbNewTokenRewardType = InferModel<typeof tokenRewards, 'insert'>
export type dbNewVotingPolicyType = InferModel<typeof votingPolicy, 'insert'>
export type dbNewWeightedVotingStrategyType = InferModel<typeof weightedVotingStrategy, 'insert'>
export type dbNewArcadeVotingStrategyType = InferModel<typeof arcadeVotingStrategy, 'insert'>
export type dbNewSubmissionType = InferModel<typeof submissions, 'insert'>
export type dbNewVoteType = InferModel<typeof votes, 'insert'>
export type dbNewTweetQueueType = InferModel<typeof tweetQueue, 'insert'>
export type dbNewUserType = InferModel<typeof users, 'insert'>
export type dbNewUserDropType = InferModel<typeof userDrops, 'insert'>
export type dbNewMintBoardType = InferModel<typeof mintBoards, 'insert'>
export type dbNewMintBoardPostType = InferModel<typeof mintBoardPosts, 'insert'>
export type dbNewZoraEditionType = InferModel<typeof zoraEditions, 'insert'>
export type dbNewSubmissionDropType = InferModel<typeof submissionDrops, 'insert'>
export type dbNewEditionMintType = InferModel<typeof editionMints, 'insert'>