BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000),
    [googleId] NVARCHAR(1000),
    [githubId] NVARCHAR(1000),
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [User_googleId_key] UNIQUE NONCLUSTERED ([googleId]),
    CONSTRAINT [User_githubId_key] UNIQUE NONCLUSTERED ([githubId])
);

-- CreateTable
CREATE TABLE [dbo].[Item] (
    [id] INT NOT NULL IDENTITY(1,1),
    [description] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [translatedName] NVARCHAR(1000),
    [originalName] NVARCHAR(1000),
    [transliteratedName] NVARCHAR(1000),
    [category] NVARCHAR(1000) NOT NULL,
    [genres] NVARCHAR(1000) NOT NULL,
    [startDate] DATETIME2 NOT NULL,
    [averageScore] FLOAT(53) NOT NULL,
    [coverImage] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Item_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Item_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Item] ADD CONSTRAINT [Item_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
