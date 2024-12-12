Команды установки приложения

k8s:

1. папка metrics
   В charts.yaml прописаны репозитории (prometheus, grafana, ingress-nginx, rabbitmq)
   1) sudo helm dependency update
   2) sudo helm install metrics .

1. папка auth
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install auth .
   3) После запуска pod-a с postgresql:
   - sudo kubectl apply -f job-auth.yaml - для миграций в сервис авторизации

2. папка billing
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install billing .
   3) После запуска pod-a с postgresql:
   - sudo kubectl apply -f job-billing.yaml - для миграций в сервис биллинга

3. папка notification
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install notification .
   3) После запуска pod-a с postgresql:
   - sudo kubectl apply -f job-auth.yaml - для миграций в сервис авторизации   
   - sudo kubectl apply -f job-billing.yaml - для миграций в сервис биллинга
   - sudo kubectl apply -f job-notification.yaml - для миграций в сервис уведомлений
   - sudo kubectl apply -f job-order.yaml - для миграций в сервис заказов
  
4. папка order
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install notification .
   3) После запуска pod-a с order:
   - sudo kubectl apply -f job-order.yaml - для миграций в сервис заказов
  

Описание архитектурного решения и схема взаимодействия сервисов

![image](https://github.com/user-attachments/assets/7bfa2bed-eb9b-4fcd-89ff-8491e28d9ef1)

Для решения был выбран подход с асинхронным общением между микросервисами. Для лющения был выбран брокер rabbitMq
