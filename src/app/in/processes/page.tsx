export default async function Processes() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center">
      <Suspense
        fallback={
          <div>
            <h1>Carregando...</h1>
          </div>
        }
      ></Suspense>
      <h1>Processos</h1>
    </div>
  )
}
