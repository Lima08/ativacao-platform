// interface FormSubmitEvent extends Event {
//   target: HTMLFormElement
// }
type FormCustomProps = {
  children: React.ReactNode
  submitForm: (event: any) => void
}

export default function CampaignRegister({
  children,
  submitForm
}: FormCustomProps) {
  return (
    <form
      className="border-grey bg-white p-5 rounded-lg mt-5 mb-5 w-10/12 mx-auto"
      onSubmit={submitForm}
    >
      {children}
    </form>
  )
}
