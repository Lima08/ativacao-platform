import { Dispatch, Fragment, SetStateAction, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'

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
          className="relative z-30"
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
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white  w-10/12 h-[650px] md:h-[575px]  my-0 md:mb-0 shadow-xl transition-all">
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
                  <div className="bg-gray-50 h-3/4 px-4 py-3 flex items-center justify-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 mr-4"
                        onClick={previousItem}
                        cursor="pointer"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="w-3/4 flex items-center justify-center flex-col">
                      <a href={medias[index]} target="_blank">
                        <Image
                          src={medias[index]}
                          alt=""
                          width={300}
                          height={100}
                        />
                      </a>
                    </div>
                    {/* <img src={medias[index]} alt="" width="250px" /> */}
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 ml-4"
                        onClick={nextItem}
                        cursor="pointer"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="font-bold my-2">
                    <p className="text-sm font-bold">
                      Clique na mídia para zoom
                    </p>
                    <p>
                      {index + 1} / {medias.length}
                    </p>
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
