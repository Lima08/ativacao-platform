type FormCustomProps = {
  children: React.ReactNode
  submitForm: (event: any) => void
  customStyles?: string
}

export default function FormCustom({
  children,
  submitForm,
  customStyles
}: FormCustomProps) {
  return (
    <form
      className={
        customStyles ||
        'border-grey bg-white p-5 rounded-lg mt-5 mb-5 w-10/12 mx-auto'
      }
      onSubmit={submitForm}
    >
      {children}
    </form>
  )
}
