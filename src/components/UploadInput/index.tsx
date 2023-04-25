'use client'

export default function UploadInput({
  handleSetFile,
  disabled
}: {
  handleSetFile: any
  disabled: boolean
}) {

  return (
    <>
      <input
        type="file"
        name="image"
        onChange={handleSetFile}
        disabled={disabled}
      />
    </>
  )
}
