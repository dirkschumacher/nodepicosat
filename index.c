#include <node_api.h>
#include <napi-macros.h>

#include "lib/picosat.h"

NAPI_METHOD(node_picosat_sat) {
  NAPI_ARGV(2)
  NAPI_ARGV_BUFFER(formula, 0)
  NAPI_ARGV_BUFFER(assumptions, 1)

  PicoSAT *pico_ptr = picosat_init();

  int * formula_int = (int*) formula;
  size_t i;
  for(i = 0; i < (formula_len / 4); i++) {
    picosat_add(pico_ptr, formula_int[i]);
  }

  int * assumptions_int = (int*) assumptions;
  for(i = 0; i < (assumptions_len / 4); i++) {
    picosat_assume(pico_ptr, assumptions_int[i]);
  }

  int status_code = picosat_sat(pico_ptr, -1);
  napi_value result_array;

  if (status_code == PICOSAT_SATISFIABLE) {
    int nvars = picosat_variables(pico_ptr);
    napi_create_array_with_length(env, nvars + 1, &result_array);

    // get and set the variable solutions
    size_t i;
    for (i = 1; i <= nvars; i++) {
      int val = picosat_deref(pico_ptr, i) * i;
      napi_value int_val;
      napi_create_int32(env, val, &int_val);
      napi_set_element(env, result_array, i, int_val);
    }
  } else {
    // returns an array with just the status code as first element
    napi_create_array_with_length(env, 1, &result_array);
  }

  // set the status code as first element of the array
  napi_value js_status_code;
  napi_create_int32(env, status_code, &js_status_code);
  napi_set_element(env, result_array, 0, js_status_code);

  picosat_reset(pico_ptr);

  return result_array;
}

NAPI_INIT() {
  NAPI_EXPORT_FUNCTION(node_picosat_sat)
}
