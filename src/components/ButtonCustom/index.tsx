type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'warning' | 'danger' | 'default'
  onClick?: () => void
  disabled?: boolean
  children?: React.ReactNode
}

export default function CustomButton({
  type = 'button',
  variant = 'default',
  onClick,
  disabled,
  children
}: ButtonProps) {
  let buttonClasses =
    'bg-red-400 bg-transparent text-gray-800 hover:text-gray-900 font-semibold py-2 px-4 border border-gray-800 rounded'

  let dynamicClasses = ''
  if (variant === 'primary') {
    dynamicClasses = ' bg-blue-500 hover:bg-blue-600 text-white'
  } else if (variant === 'warning') {
    dynamicClasses = ' bg-yellow-400 hover:bg-yellow-600 text-white'
  } else if (variant === 'danger') {
    dynamicClasses = '  bg-red-500 hover:bg-red-600 text-white'
  } else if (variant === 'default') {
    dynamicClasses =
      ' bg-white hover:bg-gray-600 hover:text-white text-gray-800'
  }

  buttonClasses += ` ${dynamicClasses}`
  return (
    <button
      id="CustomButton-button"
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${buttonClasses}`}
    >
      {children}
    </button>
  )
}
