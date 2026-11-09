import { selectThemeMode } from "@/app/app-slice"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { loginTC } from "@/features/auth/model/auth-slice"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "", rememberMe: false },
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    dispatch(loginTC(data))
    reset()
  }

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login use the login and password of Basic authentication from
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://apihub.it-incubator.io"
                target="_blank"
                rel="noreferrer"
              >
                APIHub
              </a>
            </p>
            <p>(Trelly API → settings)</p>
          </FormLabel>
          <FormGroup>
            <TextField label="Login" margin="normal" error={!!errors.login} {...register("login")} />
            {errors.login && <span className={styles.errorMessage}>{errors.login.message}</span>}
            <TextField
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.login}
              {...register("password")}
            />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                />
              }
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
