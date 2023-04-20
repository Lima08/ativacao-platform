type PageContainerProps = {
  pageTitle: string
  buttonTitle: string
}

function PageContainer({ pageTitle, buttonTitle }: PageContainerProps) {
  return (
    <div className="w-full">
      <div className="flex p-[50px] items-center justify-around">
        <h1 className="text-2xl font-medium">{pageTitle}</h1>
        <button className="hover:bg-[#ffd700] bg-gray-100 p-4 text-black font-medium rounded-md">
          Adicionar {buttonTitle}
        </button>
      </div>
    </div>
  )
}

// align-items: center;
//     justify-content: space-around;

export default PageContainer
