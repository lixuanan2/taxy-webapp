import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DriverService } from '@services/driver.service';
import { Driver } from '@models/driver.model';

@Component({
  selector: 'app-driver-edit',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.css']
})
export class EditDriverComponent implements OnInit {
  driver: Driver = {
    name: '',
    gender: 'male',
    birthYear: 2000,
    nif: '',
    licenseNumber: '',
    address: {
      street: '',
      number: '',
      postalCode: '',
      city: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nif = this.route.snapshot.paramMap.get('nif');
    if (!nif) return;

    this.driverService.getDriverByNif(nif).subscribe({
      next: (data) => this.driver = data,
      error: (err) => {
        alert('❌ Erro ao carregar motorista');
        this.router.navigate(['/manager/driver/driver-list']);
      }
    });
  }

  onSubmit(): void {
    this.driverService.updateDriver(this.driver.nif, this.driver).subscribe({
      next: () => {
        alert('✅ Motorista atualizado com sucesso!');
        this.router.navigate(['/manager/driver/driver-list']);
      },
      error: err => {
        alert('❌ Erro ao atualizar motorista');
        console.error(err);
      }
    });
  }
}
