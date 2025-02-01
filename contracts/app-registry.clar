;; App Registry Contract

;; Constants
(define-constant err-unauthorized (err u100))

;; Data Maps
(define-map registered-apps
  { app-id: uint }
  {
    deployment-tx: (optional (buff 32)),
    version: (string-ascii 16),
    metadata: (string-ascii 1024)
  }
)

;; Public Functions
(define-public (register-app 
  (app-id uint)
  (deployment-tx (optional (buff 32)))
  (version (string-ascii 16))
  (metadata (string-ascii 1024))
)
  (let ((core-contract .core-forge))
    (asserts! 
      (contract-call? core-contract is-app-owner app-id tx-sender)
      err-unauthorized
    )
    (ok (map-set registered-apps
      { app-id: app-id }
      {
        deployment-tx: deployment-tx,
        version: version,
        metadata: metadata
      }
    ))
  )
)

;; Read Only Functions  
(define-read-only (get-registered-app (app-id uint))
  (ok (map-get? registered-apps {app-id: app-id}))
)
