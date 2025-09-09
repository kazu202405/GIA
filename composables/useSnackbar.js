export const useSnackbar = () => {
  const snackbar = useState("snackbar", ()=>({
    show: false, 
    message: ""
  }))

  const getters = {
    snackbar: () => snackbar.value,
  };

  const actions = {
    showSnackBar: (message) => {
      snackbar.value.show = true;
      snackbar.value.message = message;
      setTimeout(() => {
        snackbar.value.show = false;
      }, 3000);
    },
  };

  return {
    snackbar,
    getters,
    ...actions,
  }
}