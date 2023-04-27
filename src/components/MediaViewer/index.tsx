import { Dispatch, Fragment, SetStateAction, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface ModalProps {
  title?: string
  children?: React.ReactNode
  description: string
  imageSource: string
  medias: string[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function Modal({
  title,
  description,
  imageSource,
  medias,
  children,
  open,
  setOpen
}: ModalProps) {
  const [index, setIndex] = useState(0)

  function previousItem() {
    if (index === 0) return setIndex(medias.length - 1)

    return setIndex(index - 1)
  }

  function nextItem() {
    if (index === medias.length - 1) return setIndex(0)

    return setIndex(index + 1)
  }

  const cancelButtonRef = useRef(null)

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex md:ml-[200px] md:mt-5 min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white  w-3/4 md:w-2/4 md:h-[450px] h-[550px] my-0 md:mt-3 md:mb-0 shadow-xl transition-all">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex items-center justify-center">
                    <div className="flex items-center">
                      <div className="mt-3 text-center sm:mt-0 sm:text-center">
                        <Dialog.Title
                          as="h2"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {title}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 mr-4"
                      onClick={nextItem}
                      cursor="pointer"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <img src={medias[index]} alt="" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 ml-4"
                      onClick={previousItem}
                      cursor="pointer"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
