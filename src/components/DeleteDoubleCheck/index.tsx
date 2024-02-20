import CustomButton from 'components/ButtonCustom'
import DialogCustom from 'components/DialogCustom'

type DeleteDoubleCheckProps = {
  open: boolean
  title: string
  deleteItem: (a: string) => void
  closeDoubleCheck: () => void
}

export default function DeleteDoubleCheck(props: DeleteDoubleCheckProps) {
  const { open, title, deleteItem, closeDoubleCheck } = props
  return (
    <DialogCustom title={title} open={open}>
      <CustomButton onClick={() => closeDoubleCheck()} name="no">
        Não
      </CustomButton>
      <CustomButton
        onClick={(e: any) => {
          deleteItem(e.target.name)
        }}
        variant="danger"
        name="yes"
      >
        Sim
      </CustomButton>
    </DialogCustom>
  )
}
