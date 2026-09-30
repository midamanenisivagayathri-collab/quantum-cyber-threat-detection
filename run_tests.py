"""Automated test runner for Quantum-Inspired Cyber Threat Detection."""

import sys
import unittest
import time

if __name__ == "__main__":
    print("=" * 70)
    print("RUNNING AUTOMATED TEST SUITE (QUANTUM SIMULATION & SECURITY VERIFICATION)")
    print("=" * 70)
    
    start_time = time.time()
    loader = unittest.TestLoader()
    suite = loader.discover(start_dir="backend/tests", pattern="test_*.py")
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    elapsed = time.time() - start_time
    print("=" * 70)
    print(f"Ran {result.testsRun} tests in {elapsed:.3f}s")
    if result.wasSuccessful():
        print("ALL TESTS PASSED SUCCESSFULLY! (100% Deterministic & Reproducible)")
        sys.exit(0)
    else:
        print(f"FAILED (failures={len(result.failures)}, errors={len(result.errors)})")
        sys.exit(1)
