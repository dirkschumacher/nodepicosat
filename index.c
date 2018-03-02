#include <node_api.h>
#include <napi-macros.h>
#include "lib/picosat.h"

NAPI_METHOD(node_picosat_sat) {
  NAPI_ARGV(2)
  NAPI_ARGV_BUFFER(formula, 0)
  NAPI_ARGV_BUFFER(assumptions, 1)

  PicoSAT *pico_ptr = picosat_init();

  for(size_t i = 0; i < formula_len; i++) {
    picosat_add(pico_ptr, formula[i]);
  }

  for(size_t i = 0; i < assumptions_len; i++) {
    picosat_assume(pico_ptr, assumptions[i]);
  }

  int res = picosat_sat(pico_ptr, -1);
  napi_value result_array;
  if (res == PICOSAT_SATISFIABLE) {
    int nvars = picosat_variables(pico_ptr);
    napi_create_array_with_length(env, nvars, &result_array);

    // get and set the variable solutions
    for (int i = 1; i <= nvars; i++) {
      int val = picosat_deref(pico_ptr, i) * i;
      napi_value int_val;
      napi_create_int32(env, val, &int_val);
      napi_set_element(env, result_array, i - 1, int_val);
    }
  } else {
    // returns empty array if not satisfiable
    napi_create_array_with_length(env, 0, &result_array);
  }

  picosat_reset(pico_ptr);

  return result_array;
}

NAPI_INIT() {
  NAPI_EXPORT_FUNCTION(node_picosat_sat)
}
