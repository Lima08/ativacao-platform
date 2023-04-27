type ToggleInputProps = {
  isActive: boolean
  toggleActivation: () => void
}

export default function ToggleInput({
  isActive,
  toggleActivation
}: ToggleInputProps) {
  return (
    <div className="flex items-center">
      <label
        htmlFor="toggle-input"
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input
            id="toggle-input"
            type="checkbox"
            className="hidden"
            checked={isActive}
            onChange={toggleActivation}
          />
          <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">
          {isActive ? 'Ativo' : 'Inativo'}
        </div>
      </label>
    </div>
  )
}
