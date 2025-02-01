;; CoreForge Main Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))

;; Data Variables
(define-map apps 
  { app-id: uint } 
  { 
    owner: principal,
    name: (string-ascii 64),
    description: (string-ascii 256),
    status: (string-ascii 16)
  }
)

(define-data-var next-app-id uint u1)

;; Public Functions
(define-public (create-app (name (string-ascii 64)) (description (string-ascii 256)))
  (let ((app-id (var-get next-app-id)))
    (map-insert apps 
      { app-id: app-id }
      { 
        owner: tx-sender,
        name: name,
        description: description,
        status: "active"
      }
    )
    (var-set next-app-id (+ app-id u1))
    (ok app-id)
  )
)

(define-public (update-app-status (app-id uint) (new-status (string-ascii 16)))
  (let ((app (unwrap! (map-get? apps {app-id: app-id}) (err err-not-found))))
    (asserts! (is-eq tx-sender (get owner app)) (err err-owner-only))
    (ok (map-set apps 
      {app-id: app-id}
      (merge app {status: new-status})
    ))
  )
)

;; Read Only Functions
(define-read-only (get-app (app-id uint))
  (ok (map-get? apps {app-id: app-id}))
)

(define-read-only (get-app-count)
  (ok (var-get next-app-id))
)
