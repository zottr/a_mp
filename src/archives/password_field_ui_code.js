// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// const [showPassword, setShowPassword] = useState(false);
// const handleClickShowPassword = () => setShowPassword((show) => !show);

// const [password, setPassword] = useState('');
// const [passwordError, setPasswordError] = useState('');

// const handlePasswordChange = (e) => {
//   setPassword(e.target.value);
//   const regex = /[^a-zA-Z0-9\s]/;
//   if (e.target.value.length < 8) {
//     setPasswordError('Password should have minimum length 8');
//   } else if (regex.test(e.target.value) === false) {
//     setPasswordError('  ');
//   } else {
//     setPasswordError('');
//   }
// };

// <TextField
//   type={showPassword ? 'text' : 'password'}
//   variant="outlined"
//   label="Password"
//   fullWidth
//   InputProps={{
//     endAdornment: (
//       <InputAdornment position="end">
//         <IconButton
//           aria-label="toggle password visibility"
//           onClick={handleClickShowPassword}
//         >
//           {showPassword ? <VisibilityOff /> : <Visibility />}
//         </IconButton>
//       </InputAdornment>
//     ),
//   }}
//   onChange={handlePasswordChange}
//   helperText={passwordError}
//   error={passwordError !== '' ? true : false}
// />;
