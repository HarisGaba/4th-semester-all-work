import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
export default function PasswordField({
  id = 'password',
  label = 'Password',
  newPassword = false,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="grid min-w-0 gap-1">
      <label htmlFor={id}>{label}</label>
      <div className="relative [&_input]:pr-12! [&_button]:absolute [&_button]:right-0 [&_button]:top-0 [&_button]:grid [&_button]:size-11 [&_button]:place-items-center [&_button]:text-[#62655b]">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          required
          minLength={newPassword ? 8 : undefined}
          maxLength={72}
          autoComplete={newPassword ? 'new-password' : 'current-password'}
        />
        <button
          type="button"
          aria-label={(visible ? 'Hide ' : 'Show ') + label.toLowerCase()}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}
